export function makeDraggable(element) {
  let offsetX = 0,
    offsetY = 0,
    isDragging = false;

  element.addEventListener("mousedown", (e) => {
    isDragging = true;
    offsetX = e.clientX - element.offsetLeft;
    offsetY = e.clientY - element.offsetTop;
    element.style.cursor = "grabbing";
    e.preventDefault();
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    element.style.left = `${e.clientX - offsetX}px`;
    element.style.top = `${e.clientY - offsetY}px`;
    element.style.right = "auto";
    element.style.bottom = "auto";
    element.style.position = "fixed";
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
    element.style.cursor = "grab";
  });
}
