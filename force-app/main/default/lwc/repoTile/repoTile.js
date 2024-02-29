import { LightningElement,api,track } from 'lwc';
import chartjs from '@salesforce/resourceUrl/ChartJs';
import { loadScript } from 'lightning/platformResourceLoader';

export default class RepoTile extends LightningElement {
    @api repo
    @api userName
    @track show=false
    token = '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'
    chart

    renderedCallback(){
        this.hideCanvas()
        Promise.all([loadScript(this, chartjs)])
        .then(() => {
            console.log('done')
        })
        .catch(error => {
            console.log(error)
        });
    }
    toggleShow(){
        this.show = !this.show;
        console.log(this.show);

        if (this.show) {
            this.showCanvas();
        } else {
            this.hideCanvas();
        }
    }
    showCanvas() {
        const canvas = this.template.querySelector('.donutChart');
        if (canvas) {
            canvas.style.display = 'block';
        }
    }

    hideCanvas() {
        const canvas = this.template.querySelector('.donutChart');
        if (canvas) {
            canvas.style.display = 'none';
        }
    }
    donutChart(value,labels){
        const data = {
            labels,
            datasets: [{
              label: 'My First Dataset',
              data: value,
              backgroundColor: [
                'rgb(255, 99, 132)',
                'rgb(54, 162, 235)',
                'rgb(255, 205, 86)'
              ],
              hoverOffset: 4
            }]
          };
       
          const config = {
            type: 'doughnut',
            data: data,
          };
          console.log(value)
          const ctx = this.template.querySelector('canvas.donutChart').getContext('2d');
        this.chart = new window.Chart(ctx, JSON.parse(JSON.stringify(config)));

    }
    
    async handleChange(){
        console.log(this.userName,this.repo.name)
        const [labels,data] = await this.getLanguagePercentage(this.userName,this.repo.name)
        console.log(JSON.stringify(data),JSON.stringify(labels))
        this.show = !this.show;
        console.log(this.show);

        if (this.show) {
            this.showCanvas();
        } else {
            this.hideCanvas();
        }
        this.donutChart(data,labels)

    }


    async  getLanguagePercentage(owner, repository) {
        console.log(owner,'hello')
        const options = {
            headers: {
                Authorization: `Bearer ${this.token}`
            }
        };
        const url = `https://api.github.com/repos/${owner}/${repository}/languages`;
        const response = await fetch(url,options);
        const languages = await response.json();
        
        const totalBytes = Object.values(languages).reduce((acc, curr) => acc + curr, 0);
        const languagePercentages = {};
        const label = []
        const data = []
        for (const language in languages) {
            const bytes = languages[language];
            const percentage = (bytes / totalBytes) * 100;
            data.push(percentage.toFixed(2)-0);
            label.push(language)
        }
        
        return [label,data];
    }

}