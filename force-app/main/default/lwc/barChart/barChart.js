import { LightningElement,api } from 'lwc';
import chartjs from '@salesforce/resourceUrl/ChartJs';
import { loadScript } from 'lightning/platformResourceLoader';

export default class BarChart extends LightningElement {
    @api chart
 
    isChartJsInitialized;
    
    renderedCallback() {
        if (this.isChartJsInitialized) {
            return;
        }

        const labels = this.chart.label
        const data = {
            labels: labels,
            datasets: [{
                label: 'Top 5 repos (star count)',
                data: this.chart.repoData,
                backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(255, 205, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(201, 203, 207, 0.2)'
                ],
                borderColor: [
                'rgb(255, 99, 132)',
                'rgb(255, 159, 64)',
                'rgb(255, 205, 86)',
                'rgb(75, 192, 192)',
                'rgb(54, 162, 235)',
                'rgb(153, 102, 255)',
                'rgb(201, 203, 207)'
                ],
                borderWidth: 1
            }]
        };
       
        const config = {
            type: 'bar',
            data:data,
            options: {
            scales: {
                y: {
                    beginAtZero: true
                }
                }
            },
        };
        Promise.all([loadScript(this, chartjs)])
            .then(() => {
                this.isChartJsInitialized = false;
                const ctx = this.template.querySelector('canvas.barChart').getContext('2d');
                this.chart = new window.Chart(ctx, JSON.parse(JSON.stringify(config)));
            })
            .catch(error => {
                console.log(error)
            });
    }
}