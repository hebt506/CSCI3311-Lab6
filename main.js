import {AreaChart} from './AreaChart.js';
import {StackedAreaChart} from './StackedAreaChart.js';

d3.csv("unemployment.csv", d3.autoType).then(data => {
    data.forEach(e => {
        var row = e;
        var total = 0;
        Object.values(e).forEach((element, i) => {
            if (i > 0){        
                total += element;
            }
        })
        row.total = total;
    });
    
    const areaChart1 = StackedAreaChart(".chart-container1");
    areaChart1.update(data);  
    const areaChart2 = AreaChart(".chart-container2");
    areaChart2.update(data);

    areaChart2.on("brushed", (range)=>{
        areaChart1.filterByDate(range); 
    })

})