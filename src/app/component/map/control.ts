export class Control {
  constructor(
    controlDiv: HTMLElement,
    polygon: google.maps.Polygon
  ) {
    controlDiv.style.padding = '5px';
    const controlUI = document.createElement('div');
    controlUI.style.backgroundColor = 'yellow';
    controlUI.style.border = '1px solid';
    controlUI.style.cursor = 'pointer';
    controlUI.style.textAlign = 'center';
    controlDiv.appendChild(controlUI);
    const controlText = document.createElement('div');
    controlText.style.fontFamily = 'Arial,sans-serif';
    controlText.style.fontSize = '12px';
    controlText.style.paddingLeft = '4px';
    controlText.style.paddingRight = '4px';
    controlText.innerHTML = '<b>Fill Blue<b>';
    controlUI.appendChild(controlText);

    controlUI.addEventListener('click', () => {
      polygon.setOptions({
        strokeColor: 'blue',
        fillColor: 'blue'
      });
    });
  }

  // updatePolygon(polygon: google.maps.Polygon): void {
  //   this.controlUI.removeEventListener('click', this.fillBlue);
  //
  //   this.polygon = polygon;
  //   this.controlUI.addEventListener('click', this.fillBlue);
  // }

  // private fillBlue = () => {
  //   this.polygon.setOptions({
  //     strokeColor: 'blue',
  //     fillColor: 'blue'
  //   });
  // }
}

