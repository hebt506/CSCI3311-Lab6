export function StackedAreaChart(container) {
    const margin = ({top: 20, right: 20, bottom: 20, left: 20})
    const width = 800 - margin.left - margin.right,
    height = 450 - margin.top - margin.bottom;

    const svg = d3.select(container)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",`translate(${margin.left}, ${margin.top})`);

    const xScale = d3.scaleTime()
    .range([50, width]);

    const yScale = d3.scaleLinear()
    .range([0, height]);

    const colorScale = d3.scaleOrdinal()
    .range(d3.schemeTableau10);

    const xAxis = d3.axisBottom()
    .scale(xScale);

    const yAxis = d3.axisLeft()
    .scale(yScale);

    svg.append("g")
    .attr("class", "axis x-axis");

    svg.append("g")
    .attr("class", "axis y-axis");

    const tooltip = svg.append("text")
    .attr("class", "label")
    .attr("x", 60)
    .attr("y", 0);

    let selected = null, xDomain, data;

    function update(_data){
		data = _data;
		const keys = selected? [selected] : data.columns.slice(1);

        var stack = d3.stack()
        .keys(keys)
        .order(d3.stackOrderNone)
        .offset(d3.stackOffsetNone);

        var series = stack(data);

        colorScale.domain(keys);
        xScale.domain(xDomain? xDomain: d3.extent(data, d => d.date));
        yScale.domain([d3.max(series, d => d3.max(d, d => d[1])), 0]);

        const area = d3.area()
        .x(d => xScale(d.data.date))
        .y0(d => yScale(d[0]))
        .y1(d => yScale(d[1]));

        const areas = svg.selectAll(".area")
        .data(series, d => d.key);
        
        areas.enter()
        .append("path")
        .attr("fill", d => colorScale(d.key))
        .merge(areas)
        .attr("d", area)
        .attr("clip-path", "url(#clip)")
        .attr("class", "area")
        .on("mouseover", (event, d, i) => tooltip.text(d.key))
        .on("mouseout", (event, d, i) => tooltip.text(""))
        .on("click", (event, d) => {
            if (selected === d.key) {
                selected = null;
            } else {
                selected = d.key;
            }
        update(data); 
    });

    areas.exit().remove();

    svg.append("clipPath")
    .attr("id", "clip")
    .append("rect")
    .attr("width", width)
    .attr("height", height)
    .attr('transform', 'translate(' + 50 + ',0)');

    svg.select('.x-axis')
    .transition()
    .duration(100)
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis);

    svg.select('.y-axis')
    .transition()
    .duration(100)
    .attr('transform', 'translate(' + 50 + ',0)')
    .call(yAxis);
	}

	function filterByDate(range){
		xDomain = range;
		update(data);
	}

	return {
		update,
		filterByDate
	};
}