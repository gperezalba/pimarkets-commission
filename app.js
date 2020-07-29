const contractABI = [{"constant":true,"inputs":[],"name":"getUsers","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"pay","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_users","type":"address[]"}],"name":"setNewUsersArray","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"index","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"users","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"withdrawl","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_user","type":"address"}],"name":"setNewUser","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"isUser","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"counter","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getUserCounter","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"amount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_user","type":"address"}],"name":"isAllowed","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"toggleIsPaying","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"isPaying","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"controller","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_controller","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":false,"name":"to","type":"address"},{"indexed":false,"name":"amount","type":"uint256"},{"indexed":false,"name":"index","type":"uint256"}],"name":"Pay","type":"event"}];
const contractADDRESS = "0xB07034dC9782924d2748c4152Ec0A5682e3Da075";

const App = {
    web3: null,
    account: null,
	contract: null,

    start: async function(web3) {
        this.web3 = web3;

        try {
			this.contract = new this.web3.eth.Contract(contractABI, contractADDRESS);

            const accounts = await this.web3.eth.getAccounts();
            this.account = accounts[0];

        } catch (error) {
            console.error("Could not connect to contract or chain.");
        }
	},

	updateInfo: async function() {
		let isPaying = await this.getIsPaying();
		let amount = await this.getAmount();
		let index = await this.getIndex();
		let users = await this.getUsers();
		console.log(users)

		if (isPaying) {
			document.getElementById("info").innerHTML = "Estado: REPARTO PENDIENTE " + 
				" <br> Comisiones del día: " +
				amount/(1e18) +
				" <br> Usuarios con SmartID: " +
				users +
				" <br> Usuarios pagados: " +
				index;
		} else {
			document.getElementById("info").innerHTML = "Estado: NADA QUE REPARTIR " + 
				" <br> Usuarios con SmartID: " +
				users +
				" <br> Transferir PI a: 0xB07034dC9782924d2748c4152Ec0A5682e3Da075 ";
		}
	},

	pay: async function() {
		let isPaying = await this.getIsPaying();
		if (isPaying) {
			await this.contract.methods.pay().send({from: this.account, gas: 6283184});
			this.updateInfo();
		} else {
			alert("NADA QUE REPARTIR. TRANSFIERE PI")
		}
	},

	getIsPaying: async function() {
		let isPaying = await this.contract.methods.isPaying().call();
		return isPaying;
	},

	getIndex: async function() {
		let index = await this.contract.methods.index().call();
		return index;
	},

	getAmount: async function() {
		let amount = await this.contract.methods.amount().call();
		return amount;
	},

	getUsers: async function() {
		let users = await this.contract.methods.getUserCounter().call();
		return users;
	},
}    

window.App = App;

window.addEventListener('load', async () => {
    // Modern dapp browsers...
    if (window.ethereum) {
        window.web3 = new Web3(ethereum);
        try {
            await ethereum.enable();
            var accounts= await web3.eth.getAccounts();
        } catch (error) {
            // User denied account access...
        }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
        window.web3 = new Web3(web3.currentProvider);
        // Acccounts always exposed
    }
    // Non-dapp browsers...
    else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
    console.log(web3.version);
	App.start(window.web3);
	App.updateInfo();
});