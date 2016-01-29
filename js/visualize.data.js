'use strict';

var CHART_WIDTH = 20;
//A scale for the bar chart
var scale = d3.scale.linear()
.domain([0, 10])  // Because entries range from 0 to 10
.range([0, CHART_WIDTH]);

var labels = {
  'How would you rate your Information Visualization skills?': 'Visualization',
  'How would you rate your statistical skills?': 'Statistics',
  'How would you rate your mathematics skills?': 'Mathematics',
  'How would you rate your drawing and artistic skills?': 'Artistic',
  'How would you rate your computer usage skills?': 'Computer Savvy',
  'How would you rate your programming skills?': 'Programming',
  'How would you rate your computer graphics programming skills?': 'Graphics',
  'How would you rate your human-computer interaction programming skills?': 'Interaction',
  'How would you rate your user experience evaluation skills?': 'UX Evaluation'
}

d3.select("#sort")
  .selectAll("option")
  .data(Object.keys(labels))
  .enter()
  .append("option")
  .attr("value", function(key){ return key;})
  .text(function(key){ return labels[key];});

d3.select("#sort").on("change", function() {
  console.log(this.value);
  update(this.value);});

update(d3.select("#sort").node().value);

function update(statistic){
  // Fetch the data from the csv file
  d3.csv('data/IVIS16-Personal Survey data.csv', function(csv) {
    //Remove all div elements inside main
    d3.select("main").selectAll("div").remove();
    // The first three questions contain string data.
    var stringQuestions = Object.keys(csv[0]).slice(0,3);
    //The last nine questions yield numerical data.
    var numericalQuestions = Object.keys(csv[0]).slice(-9);
    // console.log(persuingDegree);
    // console.log(stringQuestions);
    // console.log(numericalQuestions);

    csv.sort(function(student1,student2){return student2[statistic] -student1[statistic]});

    for (var student of csv) {
      // Make an student entry div
      var entry = d3.select("main")
      .append("div")
      .attr("class", "entry");

      // Make a span to contain the bar chart
      var chart = entry.append("span")
      .attr("class", "chart");

      // Append descriptive labels to the chart
      chart.append("span")
        .text("Skills")
        .attr("class", "label");

      chart.append("span")
        .text("Count")
        .attr("class", "label right");

      // Create divs to contain a bar and a count for every question
      var line = chart.selectAll("div")
      .data(numericalQuestions.sort(function(q1,q2){
        return student[q2] -student[q1]}))
      .enter()
      .append("div");

      // Create bars
      // N.b. q is the question
      line.append("span")
      .style("width", function(q) { return scale(student[q]) + "em"; })
      .style("margin-right", function(q){return scale(10-student[q])+"em";})
      .text(function(q) { return labels[q];})
      .attr("class", function(q) { return "bar " + labels[q];});
      // Create counts

      line.append("span")
      .text(function(q) { return student[q];})
      .attr("class", function(q) { return "count " + labels[q];});

      // Make a span per entry to contain the string answers chart
      var stringAnswers = entry.append("span")
        .selectAll("div")
        .data(stringQuestions)
        .enter()
        .append("div");

      // Append questions and answers for every student
        stringAnswers.append("p")
        .text(function(q) { return q;})
        .attr("class", "question");

        stringAnswers.append("p")
        .text(function(q) { return student[q];})
        .attr("class", "answer");
    }
  })
}
