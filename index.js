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
    
    const IMG_ORANGE = "./assets/orange.webp"
    const IMG_CHOCOLATE = "./assets/chocolate.webp"
    const IMG_CAKE = "./assets/cake.webp"
    const IMG_WATERMELON = "./assets/capy card watermelon (20260304045813).webp"

    let MESSAGE = [..."Happy Birthday Risa!!"]
    let AMOUNT_ORANGES = MESSAGE.length;

    let currentOrange = 0;
    let currentPreventScrollPoint = 0;

    const BOTTOMPADDING = 50;

    let oranges_div = null;

    let bg2Active = false;
    const backgrounds_paths = [
        "./assets/bg01-Sky.webp",
        "./assets/bg02-Onsens.webp",
        "./assets/bg03-Venezuela.webp",
        "./assets/bg04-Final.webp"
    ]
    
    let curr_bg = null;
    let bg_1 = null;
    let bg_2 = null;

    function updateMessage(str_msg) {
        MESSAGE = [...str_msg];
        AMOUNT_ORANGES = str_msg.length;
    }

    let capy_smile = false;
    let final_capy_img = null
    let letter_is_fullscreen = false;

    let sappy_letter = null;
    let backBtn = null;

    // thanks bro
    // https://www.digitalocean.com/community/tutorials/how-to-encode-and-decode-strings-with-base64-in-javascript

    // Function to encode a UTF-8 string to Base64
    function utf8ToBase64(str) {
        const encoder = new TextEncoder();
        const data = encoder.encode(str);

        const binaryString = String.fromCharCode.apply(null, data);
        return btoa(binaryString);
    }

    // Function to decode a Base64 string to UTF-8
    function base64ToUtf8(b64) {
        const binaryString = atob(b64);
        // Create a Uint8Array from the binary string.
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        const decoder = new TextDecoder();
        return decoder.decode(bytes);
    }


    function init() {

        setTimeout(() => {
            // fade loading screen
            const loadingScreen = document.getElementById("loadingScreen");
            loadingScreen.style.pointerEvents = "none";
            loadingScreen.style.opacity = 0.0;
        }, 500)


        const searchParams = new URLSearchParams(window.location.search);
        
        if (searchParams.has("msg")) {
            const msgqparam = searchParams.get('msg')
            updateMessage(msgqparam)
        }
        if (searchParams.has("msg64")) {
            const msgqparam = searchParams.get('msg64')
            try {
                const str = base64ToUtf8(msgqparam);
                console.log("base64 msg: " + str)
                updateMessage(str);
            } catch (e) {
                console.error("couldnt convert base64string, showing error" + e);
                alert("error! couldn't convert base64 string. setting message to \"hi!\"")
                updateMessage("hi!")
            }
        }

        bg_1 = document.getElementById("bg-1")
        bg_2 = document.getElementById("bg-2")

        // swapBgs(backgrounds_paths[0])

        oranges_div = document.getElementById("orange_stack")

        for (let i = 0; i < AMOUNT_ORANGES; i++) {

            const orange_div = document.createElement("div")
            orange_div.classList.add('orange')

            const img = document.createElement("img")
            img.draggable = false
            img.style.width = "100%"

            // randomly set oranges or other foods!!
            const randFloat = Math.random();
            if (randFloat > 0.90) {
                img.src = IMG_CAKE
            } else if (randFloat > 0.80) {
                img.src = IMG_WATERMELON   
            } else if (randFloat > 0.70) {
                img.src = IMG_CHOCOLATE
            } else {
                img.src = IMG_ORANGE
            }
            
            if (i === 0 || i === AMOUNT_ORANGES - 1) {
                img.src = IMG_ORANGE
            }
            
            orange_div.appendChild(img);

            // console.log(Math.sin((i / AMOUNT_ORANGES) * (Math.PI * 2) * 2))
            // console.log(Math.sin((i / AMOUNT_ORANGES) * (Math.PI * 2)))
            const rad = ((i + 1) / AMOUNT_ORANGES) * (Math.PI * 2)
            const x = Math.sin(2 * rad)

            // img.style.transform = `translateX(${(i / AMOUNT_ORANGES) * 100}px)`
            orange_div.style.transform = `scale(1.175) translateX(${x * 100}px)`

            // only add event listener to first orange!
            if (i === 0) {
                orange_div.addEventListener("click", onOrangeClicked, { once: true})
            }            
            
            oranges_div.appendChild(orange_div)
        }
        
        currentPreventScrollPoint = getCurrentPreventScrollPoint();
        
        window.scrollTo({   
            top: currentPreventScrollPoint - window.innerHeight,  // Vertical position
            left: 0,   // Horizontal position
            behavior: 'smooth' // Animates the scroll smoothly
        });
        
        // removed custom message thing
        // const info = document.getElementById("info")
        // info.addEventListener("click", createCustomUserMessage)

        ABSOLUTE_PAGE_HEIGHT = Math.max(
                document.body.scrollHeight, 
                document.documentElement.scrollHeight, 
                document.body.offsetHeight, 
                document.documentElement.offsetHeight, 
                document.body.clientHeight, 
                document.documentElement.clientHeight
            );

        final_capy_img = document.getElementById("final_capy")
        final_capy_img.addEventListener("click", onCapyClicked)
    
        sappy_letter = document.getElementById("my_letter");
        sappy_letter.addEventListener("click", onLetterClicked);
    
        backBtn = document.getElementById("backBtn")
        backBtn.addEventListener("click", onBackButtonClicked)

    }

    function onCapyClicked(event) {
        // toggle capy image when clicked
        console.log("capy click")
        if(capy_smile) {
            final_capy_img.src = "./assets/capy card final capy 1 (20260304010039 cutout).webp"
        } else {
            final_capy_img.src = "./assets/capy card final capy 2 (20260304010249 cutout).webp"
        }
        capy_smile = !capy_smile;
    }

    function onLetterClicked(event) {
        console.log("letterclicked")

        sappy_letter.classList.add("fullscreen")
        backBtn.style.display = "block"
        backBtn.style.opacity = 1

    }

    function onBackButtonClicked(event) {
        sappy_letter.classList.remove("fullscreen")
        backBtn.style = null

        window.scrollTo({   
            top: ABSOLUTE_PAGE_HEIGHT,  // Vertical position
            left: 0,   // Horizontal position
            behavior: 'smooth' // Animates the scroll smoothly
        });
    }

    function createCustomUserMessage() {
        try {
            let user_msg = prompt(`What is your message?\nMost multilingual characters should be supported. (e.g: 'Hello, 世界!') \nWarning: some emojis are unsupported, like skin color emojis 👦🏻`)
            if (user_msg == null || user_msg == "") {
                user_msg = "hi!";
            }
    
            const user_msg_base64 = utf8ToBase64(user_msg);

            const final_url = `${window.location.origin}/?msg64=${encodeURIComponent(user_msg_base64)}`
            
            if (confirm(`Success! Select OK if you want the url:\n${final_url}\ncopied to your clipboard. Send it to someone!!! Redirecting to the new link...\n----\nExtra technical info:\nIn the link, the message is encoded in base64 so the recipient doesn't see the message. For instance, like this set of characters: d2hhdCdzIGdvb2Q=. If you want to manually test a sentance, you can replace \"msg64\" with just \"msg\" in the address bar. for example: /?msg=Hello World`)) {
                navigator.clipboard.writeText(final_url)
            }
            window.location.href = final_url
        } catch (e) {
            alert("Sorry, there was an error in using your message.\n-------\n" + e)
        }
    }

    function onOrangeClicked(e) {
        const elem = e.currentTarget;
        
        currentOrange++;

        // add click event listeners to next orange!
        const nextOrange = oranges_div.childNodes[currentOrange];
        if (nextOrange) {
            nextOrange.addEventListener("click", onOrangeClicked, { once: true})
        }

        // clone orange for fall animation
        const clone = elem.cloneNode(true)
        clone.style = ""
        clone.style.zIndex = -1
        document.body.appendChild(clone)
        
        // replace original elem's image with p tag         
        elem.childNodes.forEach(node => {
            node.remove();
        })
        const text = document.createElement("p")
        text.textContent = MESSAGE[currentOrange-1];
        text.style.zIndex = -50
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
            setTimeout(() => {
                console.log("HAPPY")

                final_capy_img.src = "./assets/capy card final capy 2 (20260304010249 cutout).webp"
                final_capy_img.style.filter = "drop-shadow(0px 0px 24px #fd9003)"

                capy_smile = true;
            }, 1750)
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

        // if the last orange clicked is the last one, return bottom of page
        if (currentOrange > oranges_div.childNodes.length - 1) {

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

    function swapBgs(bg_swapto) {
        if (!bg_1 || !bg_2) {
            console.error("NO BGs!!!")
            return;
        }

        const invis = "invisible"
        if (bg2Active) {
            // set bg2 src to bg_swapto
            bg_2.src = bg_swapto;

            // set bg1 to invisible
            bg_1.classList.add(invis)
            
            // remove invisible from bg2
            bg_2.classList.remove(invis)

            bg2Active = false
            
        } else {
            // set b1 src to bg_swapto
            bg_1.src = bg_swapto
            
            // setbg2 to invisible
            bg_2.classList.add(invis)
            
            // remove invisible from bg1
            bg_1.classList.remove(invis)

            bg2Active = true
        }
    }

    function onScroll() {

        // RESTRICT SCROLL

        const WINDOW_OFFSET = window.innerHeight;
        
        if (window.scrollY + WINDOW_OFFSET > currentPreventScrollPoint) {
            console.log("resetting scroll")
            window.scrollTo({   
                top: currentPreventScrollPoint - WINDOW_OFFSET,  // Vertical position
                left: 0,   // Horizontal position
                behavior: 'smooth' // Animates the scroll smoothly
            });
        }

        // CHECK IF U GOTTA CHANGE BACKGROUND
        
        const currAbsPageScrollPosNormalized = (window.scrollY + (window.innerHeight / 2)) / ABSOLUTE_PAGE_HEIGHT
        checkpageScrollToBackground(currAbsPageScrollPosNormalized)
    }

    function checkpageScrollToBackground(currPgScroll) {

        // if (!bg_1) {
        //     console.error("no bg img!")
        //     return;
        // }

        if (currPgScroll > 0.5) {
            bg_1.classList.add("invisible")
        }

        // let whichBgIdx = Math.floor(currPgScroll * backgrounds_paths.length);
        // if (whichBgIdx >= backgrounds_paths.length) {
        //     whichBgIdx = backgrounds_paths.length - 1;
        // }
        // const chosenBg = backgrounds_paths[whichBgIdx];

        // console.log(`${currPgScroll} ${whichBgIdx}`)

        // if (curr_bg === chosenBg) {
        //     return
        // }

        // curr_bg = backgrounds_paths[whichBgIdx];
        // swapBgs(chosenBg)

    }

})();