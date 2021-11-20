import Web3Modal from "web3modal";
import { contract_address, contract_abi} from '../config';

async function connect_wallet(){
    if(Web3.givenProvider){
      const providerOptions = {
        /* See Provider Options Section */
      };
      
      const web3Modal = new Web3Modal({
        network: "mainnet", // optional
        cacheProvider: true, // optional
        providerOptions // required
      });
      
      const provider = await web3Modal.connect();
      const web3 = new Web3(provider);

      web3.eth.net.getId().then((result) => { 
    
      console.log("Network id: "+result)
      if(result !== 4){
          alert("Wrong Network Selected. Select Rinkyby Testnet");
        }
      })

    }else{
      alert("Web3 Not Found");
    }

  }

  async function mint_nft(){

      if(Web3.givenProvider ){ 

        const web3 = new Web3(Web3.givenProvider);
        await Web3.givenProvider.enable()
        const contract = new web3.eth.Contract(contract_abi, contract_address);
  
        const addresses = await web3.eth.getAccounts()
        const address = addresses[0]
        console.log("addresses[0]: "+addresses[0])
        // console.log("addresses[1]: "+addresses[1])
        // console.log("Default address: "+await web3.eth.defaultAccount)

  
        const result = await contract.methods.buy().send({from : address, value: web3.utils.toWei("0.042","ether"), gas: 3000000})
  
      }

  }
  connect_wallet()