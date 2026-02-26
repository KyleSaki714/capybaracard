"use strict";

/**
 * todos
 * prevent user from scrolling past what they've already clicked
 * keep track of what user clicked
 */


(() => {

    window.addEventListener("load", init)

    window.addEventListener("scroll", onScroll);

    let ABSOLUTE_PAGE_HEIGHT;

    const AMOUNT_ORANGES = 15;

    // starts at AMOUNT_ORANGES, is subtracted on every orange click
    let currentOrange = 0;
    let currentPreventScrollPoint = 0;

    const BOTTOMPADDING = 50;

    const oranges_div = document.createElement("div");

    function init() {
        console.log("sup")

        oranges_div.id = "orange_stack"

        for (let i = 0; i < AMOUNT_ORANGES; i++) {

            const img = document.createElement("img")
            img.src = "./tralalero_tralala.jpg"
            img.classList.add('orange')

            // console.log(Math.sin((i / AMOUNT_ORANGES) * (Math.PI * 2) * 2))
            // console.log(Math.sin((i / AMOUNT_ORANGES) * (Math.PI * 2)))
            const rad = ((i + 1) / AMOUNT_ORANGES) * (Math.PI * 2)
            const x = Math.sin(2 * rad)
            console.log(x)

            // img.style.transform = `translateX(${(i / AMOUNT_ORANGES) * 100}px)`
            img.style.transform = `translateX(${x * 100}px)`

            
            img.addEventListener("click", onOrangeClicked, { once: true})
            
            oranges_div.appendChild(img)
        }
        
        document.body.appendChild(oranges_div)
        currentPreventScrollPoint = getCurrentPreventScrollPoint();
        
        window.scrollTo({   
            top: currentPreventScrollPoint - window.innerHeight,  // Vertical position
            left: 0,   // Horizontal position
            behavior: 'smooth' // Animates the scroll smoothly
        });
        
        // CAPYBARA
        const capy_div = document.createElement("div")
        capy_div.id = "capy"

        const img = document.createElement("img")
        img.src = "./bad piggie drip.jpg"

        capy_div.appendChild(img)
        document.body.appendChild(capy_div);

        const info = document.createElement("div");
        info.id = "info"
        info.innerHTML = `
            <a href="#">Create your own</a>
            <p>Kyle S. 2026</p>
        `

        document.body.appendChild(info)

    }

    function onOrangeClicked(e) {
        const elem = e.currentTarget;
        
        elem.style.filter = "blur(5px) brightness(150%) contrast(120%)"

        currentOrange++;
        console.log(currentOrange)

        currentPreventScrollPoint = getCurrentPreventScrollPoint();
        
        window.scrollTo({   
            top: currentPreventScrollPoint - window.innerHeight,  // Vertical position
            left: 0,   // Horizontal position
            behavior: 'smooth' // Animates the scroll smoothly
        });

        if (currentOrange === AMOUNT_ORANGES) {
            console.log("HAPPY")
        }
    }

    // gets the posiiton of 1 orange ahead to prevent scrolling past that point
    function getCurrentPreventScrollPoint() {
        if (currentOrange + 1 > oranges_div.childNodes.length - 1) {

            ABSOLUTE_PAGE_HEIGHT = Math.max(
                document.body.scrollHeight, 
                document.documentElement.scrollHeight, 
                document.body.offsetHeight, 
                document.documentElement.offsetHeight, 
                document.body.clientHeight, 
                document.documentElement.clientHeight
            );

            return ABSOLUTE_PAGE_HEIGHT
        }
        
        
        const orange = oranges_div.childNodes.item(currentOrange)
        // console.log(orange)
        
        // previously I didn't set the height with css, but set the width. why was clientHeight 0, still?
        
        const orangeClientRect = orange.getBoundingClientRect()
        // console.log("orangeClientRect")
        // console.log(orangeClientRect)
        
        const res = window.scrollY + orangeClientRect.y + orangeClientRect.height
        // console.log(res)
        
        // console.log(`updated scroll point to ${res + BOTTOMPADDING}`)
        return res + BOTTOMPADDING;
    }

    function onScroll() {

        const WINDOW_OFFSET = window.innerHeight;
        
        if (window.scrollY + WINDOW_OFFSET > currentPreventScrollPoint) {
            console.log("past")
            window.scrollTo({   
                top: currentPreventScrollPoint - WINDOW_OFFSET,  // Vertical position
                left: 0,   // Horizontal position
                behavior: 'smooth' // Animates the scroll smoothly
            });
        }
    }

})();