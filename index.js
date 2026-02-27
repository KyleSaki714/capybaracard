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

        oranges_div.id = "orange_stack"

        for (let i = 0; i < AMOUNT_ORANGES; i++) {

            const orange_div = document.createElement("div")
            orange_div.classList.add('orange')

            const img = document.createElement("img")
            img.src = "./tralalero_tralala.jpg"
            img.draggable = false
            img.style.width = "100%"
            
            orange_div.appendChild(img);

            // console.log(Math.sin((i / AMOUNT_ORANGES) * (Math.PI * 2) * 2))
            // console.log(Math.sin((i / AMOUNT_ORANGES) * (Math.PI * 2)))
            const rad = ((i + 1) / AMOUNT_ORANGES) * (Math.PI * 2)
            const x = Math.sin(2 * rad)

            // img.style.transform = `translateX(${(i / AMOUNT_ORANGES) * 100}px)`
            orange_div.style.transform = `translateX(${x * 100}px)`

            
            orange_div.addEventListener("click", onOrangeClicked, { once: true})
            
            oranges_div.appendChild(orange_div)
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
        
        currentOrange++;

        const clone = elem.cloneNode(true)
        clone.style = ""
        clone.style.zIndex = -1
        document.body.appendChild(clone)
        
        // replace original elem's image with p tag         
        elem.childNodes.forEach(node => {
            node.remove();
        })
        const text = document.createElement("p")
        text.textContent = "sup";
        text.style.zIndex = -50
        text.style.fontSize = "4rem"
        elem.appendChild(text)
        
        // choose left or right
        const randomSign = Math.random() < 0.5 ? -1 : 1;
        
        // send clone to animate function
        const rect = elem.getBoundingClientRect();
        animateOrange(0, clone, {
            x: rect.left,
            y: rect.top + window.scrollY - rect.height,
            xvel: 50 * randomSign, // initial "jump"
            yvel: -50,
            initialSign: randomSign, // used for spin direction
            rotation: 0
        })

        currentPreventScrollPoint = getCurrentPreventScrollPoint();
        
        setTimeout(() => {
            window.scrollTo({   
                top: currentPreventScrollPoint - window.innerHeight,  // Vertical position
                left: 0,   // Horizontal position
                behavior: 'smooth' // Animates the scroll smoothly
            });
        }, 750)

        if (currentOrange === AMOUNT_ORANGES) {
            console.log("HAPPY")
        }
    }

    function animateOrange(timestamp, elem, movement) {

        const outsideScreen = movement.x + elem.width < 0 || movement.x > window.innerWidth ||
            movement.y > window.scrollY + window.innerHeight;
        if (outsideScreen) {
            elem.remove()
            return;
        }

        elem.style.position = "absolute"
        elem.style.top = 0
        elem.style.left = 0
        elem.style.transform = `translate(${movement.x}px, ${movement.y}px) `

        const gravity = 9;
        movement.yvel += gravity;

        const dragcoeff = 0.75
        movement.xvel = movement.xvel * dragcoeff;
        movement.yvel = movement.yvel * dragcoeff;

        movement.x += movement.xvel
        movement.y += movement.yvel

        elem.style.transition = "transform 0.01s"

        requestAnimationFrame((timestamp) => {
            animateOrange(timestamp, elem, movement)
        })
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
        
        // previously I didn't set the height with css, but set the width. why was clientHeight 0, still?
        
        const orangeClientRect = orange.getBoundingClientRect()
        
        const res = window.scrollY + orangeClientRect.y + orangeClientRect.height
        
        // console.log(`updated scroll point to ${res + BOTTOMPADDING}`)
        return res + BOTTOMPADDING;
    }

    function onScroll() {

        const WINDOW_OFFSET = window.innerHeight;
        
        if (window.scrollY + WINDOW_OFFSET > currentPreventScrollPoint) {
            console.log("resetting scroll")
            window.scrollTo({   
                top: currentPreventScrollPoint - WINDOW_OFFSET,  // Vertical position
                left: 0,   // Horizontal position
                behavior: 'smooth' // Animates the scroll smoothly
            });
        }
    }

})();