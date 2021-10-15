export function AreaChart(container) {
    const margin = ({top: 20, right: 20, bottom: 20, left: 20})
    const width = 800 - margin.left - margin.right,
    height = 100 - margin.top - margin.bottom;

    const svg = d3.select(container)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("fill","steelblue")
    .attr("transform",`translate(${margin.left}, ${margin.top})`);

    const xScale = d3.scaleTime()
    .range([50, width]);

    const yScale = d3.scaleLinear()
    .range([0, height]);

    const xAxis = d3.axisBottom()
    .scale(xScale);

    const yAxis = d3.axisLeft()
    .scale(yScale)
    .ticks(3);

    svg.append("g")
    .attr("class", "axis x-axis");

    svg.append("g")
    .attr("class", "axis y-axis");

    svg.append("path")
    .attr("class", "area");

    function update(data){
        xScale.domain(d3.extent(data, d => d.date));
        yScale.domain([d3.max(data, d => d.total), 0]);

        const area = d3.area()
        .x(d => xScale(d.date))
        .y1(d => yScale(d.total))
        .y0(yScale(0));

        svg.select(".area")
        .datum(data)
        .attr("d", area);

        svg.select(".x-axis")
        .transition()
        .duration(100)
        .attr("transform", 'translate(0,' + height + ')')
        .call(xAxis);

        svg.select(".y-axis")
        .transition()
        .duration(100)
        .attr("transform", 'translate(' + 50 + ',0)')
        .call(yAxis);
    }

    const brush = d3.brushX()
    .extent([[margin.left + 30, 0], [width, height]])
    .on("brush", brushed)
    .on("end", brushed);

    svg.append("g")
    .attr("class", "brush")
    .call(brush);

    const listeners = { brushed: null };

    function on(event, listener) {
        listeners[event] = listener;
    }

    function brushed(event) {
        if (event.selection) {
            listeners["brushed"](event.selection.map(xScale.invert));
        } else {
            listeners["brushed"](null);
        }
      }
    
    return {
        update,
        on
    }
}