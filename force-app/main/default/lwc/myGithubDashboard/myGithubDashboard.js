import { LightningElement,track } from 'lwc';
import chartjs from '@salesforce/resourceUrl/ChartJs';
import { loadScript } from 'lightning/platformResourceLoader';

export default class HelloWorldApp extends LightningElement {


    token = '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'
    userName = ''
    data = {}
    repos = []
    perPage = 5
    page=1
    load = false
    @track labelData = []
    @track repoData = []
    chart
    xyz

    handleInputValue(event){
        this.userName = event.target.value
    }
    async handleChange(){
        this.repos = []
        this.data = {}
        this.page=1
        this.xyz = null
        this.load = true
        this.getUserData()
        this.getRepo(1)
        await this.getTop5Repo()
        this.load = false
        this.xyz = {
            label: this.labelData,
            repoData: this.repoData 
        } 
    }
    async getRepo(page){
        this.load = true
        try {
            const options = {
                headers: {
                    Authorization: `Bearer ${this.token}`
                }
            };

            const response = await fetch(`https://api.github.com/users/${this.userName}/repos?page=${page}&per_page=${this.perPage}`, options);
            if (response.ok) {
                const value = await response.json();
                this.repos = [...this.repos,...value]
                this.load = false
            } else {
                console.error('API call failed:', response.statusText);
                this.load = false
            }
        } catch (error) {
            console.error('Error fetching API:', error);
            this.load = false
        }
    }
    async getUserData() {
        try {
            const options = {
                headers: {
                    Authorization: `Bearer ${this.token}`
                }
            };

            const response = await fetch(`https://api.github.com/users/${this.userName}`, options);
            if (response.ok) {
                this.data = await response.json();
                
            } else {
                console.error('API call failed:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching API:', error);
        }
    }
    addMore(){
        this.page = this.page+1;
        this.getRepo(this.page)
    }

    isChartJsInitialized;
    renderedCallback() {
        if (this.isChartJsInitialized) {
            return;
        }
        // load chartjs from the static resource
        Promise.all([loadScript(this, chartjs)])
            .then(() => {
                this.isChartJsInitialized = true;
                
            })
            .catch(error => {
                console.error('Error fetching API:', error);
            });
    }
    async getTop5Repo(){
        const apiUrl = `https://api.github.com/users/${this.userName}/repos`;
            
        try {
            const response = await fetch(apiUrl, {
                headers: {
                    Authorization: `Bearer ${this.token}`,
                },
            });

            if (!response.ok) {
                throw new Error(`GitHub API request failed with status ${response.status}`);
            }

            const repos = await response.json();
            const sortedRepos = repos.sort((a, b) => b.stargazers_count - a.stargazers_count);
            this.labelData = []
            this.repoData = []
            let ld = []
            let rd = []
            sortedRepos.slice(0, 5).forEach((repo, index) => {
                ld.push(repo.name)
                rd.push(repo.stargazers_count)
            });
            this.labelData = [...ld]
            this.repoData = [...rd]
        } catch (error) {
            console.error('Error fetching data:', error.message);
        }
    }
    
}
