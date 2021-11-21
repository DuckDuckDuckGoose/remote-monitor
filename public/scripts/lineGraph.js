class lineGraph {
  constructor(labels, dataConfig) {
    this.config = Object.entries(Object.assign({}, dataConfig)).map(([key, value], index) => {
      return {
        label: key,
        data: [],
        borderColor: value
      }
    });
    console.log(this.config);
    let div = document.createElement(`div`);
    div.classList.add(`module`, `module-line` );

    let canvas = document.createElement(`canvas`);
    canvas.classList.add(`canvas-line`);
    canvas.width = 200;
    canvas.height = 200;

    div.appendChild(canvas);
    this.div = document.body.appendChild(div);
    this.canvas = this.div.getElementsByClassName(`canvas-line`).item(0);
    this.ctx = this.canvas.getContext(`2d`);
    this.chart = new Chart(this.ctx, {
      type: `line`,
      data: {
        labels: labels,
        datasets: this.config
      }
    })
  }
  updateData(data) {
    this.chart.data.datasets.forEach((dataset, index) => {
      let newData = data[dataset.label];
      if(newData) {
        if(dataset.data.length >= this.maxDataSize) {
          for(let i = 0;i < (dataset.data.length - this.maxDataSize) + newData.length;i++) {
            dataset.data.shift();
          }
        }
        dataset.data.push(...newData);
      }
    });
    this.chart.update();
  }
}
