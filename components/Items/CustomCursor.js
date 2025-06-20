import { useEffect } from "react";

export default function CustomCursor() {
    useEffect(() => {
        var xp = 0,
            mouseX = 0;
        var yp = 0,
            mouseY = 0;
        var xpDot = 0,
            mouseX = 0;
        var ypDot = 0,
            mouseY = 0;

        const cursorFollower = document.querySelector(".cursorFollower");
        const cursorFollowerDot = document.querySelector(".cursorFollowerDot");

        document.addEventListener("mousemove", (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        setInterval(function () {
            xp += (mouseX - xp) / 5;
            yp += (mouseY - yp) / 5;
            cursorFollower.style.left = xp + "px";
            cursorFollower.style.top = yp + "px";
        }, 20);

        setInterval(function () {
            xpDot += (mouseX - xpDot) / 15;
            ypDot += (mouseY - ypDot) / 15;
            cursorFollowerDot.style.left = xpDot + "px";
            cursorFollowerDot.style.top = ypDot + "px";

        }, 20);
    }, []);
    return (
        <>
            <span className="cursorFollower"></span>
            <span className="cursorFollowerDot"></span>
        </>
    )
}