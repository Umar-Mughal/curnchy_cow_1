
import Web3 from "web3";
import React, { useEffect, useState } from "react";
import Web3Modal from "web3modal";
import { contract_address, contract_abi, buy_price, pre_sale_price, speedy_nodes} from '../config';
export default function Home() {
    const [title, setTitle] = useState("");
    const [walletstatus, set_walletstatus] = useState("Connect Wallet");
    useEffect(() => {
        connect_wallet();
      }, [])
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
          if(result !== 1){
              alert("Wrong Network Selected. Select Ethemerun mainnet");
            }else{set_walletstatus("Connected");}
          })
    
        }else{
          alert("Web3 Not Found");
        }
    
      }
    async function add_prelist(){

        if(Web3.givenProvider ){ 
  
          const web3 = new Web3(Web3.givenProvider);
          await Web3.givenProvider.enable()
          const contract = new web3.eth.Contract(contract_abi, contract_address);
          const addresses = await web3.eth.getAccounts()
          const address = addresses[0]
          console.log(title)
          console.log("addresses[0]: "+addresses[0])
          // console.log("addresses[1]: "+addresses[1])
          // console.log("Default address: "+await web3.eth.defaultAccount)
          const list=["0x569ab3215aa7ae9eff2fdc9a8adc1dfb30320f23",
          "0x87e1eea0ddee91efc078da655a389e3483397bb3",
          "0x5cc657f6c8a9314c9ad2ad51daa44ec929ef5b9a",
          "0xc370759ec64d44505f1c699a483e1171cc620d50",
          "0xc2e1a8860b8409798c44c35d4eace816ac85aae0",
          "0x17ea3cbc8220a894311b0f848d0412ad7c2913d1",
          "0xd8f39f50bbe519cce67a1a3e6c801c0552d3a7f9",
          "0xfeee504aee65e3a44173d5e355a624bac12fb613",
          "0x5cc657f6c8a9314c9ad2ad51daa44ec929ef5b9a",
          "0xd8f39f50bbe519cce67a1a3e6c801c0552d3a7f9",
          "0x9663c1db5a9cca008d7afc07655b1db5d790a0bb",
          "0x545c6b29c918c5f36e9ced23fdc1f9884e6a56b1",
          "0x0818549A2af083FC8DF14Ff185493939093C460e",
          "0xdefba239fbbfa47ec998fb92d9231df0262d7fb3",
          "0x5cc657f6c8a9314c9ad2ad51daa44ec929ef5b9a",
          "0xd8f39f50bbe519cce67a1a3e6c801c0552d3a7f9",
          "0xd8f39f50bbe519cce67a1a3e6c801c0552d3a7f9",
          "0x9a1fbe70d8c4ae617a0e405e51f0d9dcf5b6fd60",
          "0xd8f39f50bbe519cce67a1a3e6c801c0552d3a7f9",
          "0x87e1eea0ddee91efc078da655a389e3483397bb3"
          ]
            console.log(list);
  try{
    const estemated_Gas = await contract.methods.sendGifts(
        list
    ).estimateGas({
        from : address, 
        maxPriorityFeePerGas: null,
        maxFeePerGas: null
      });
          console.log(estemated_Gas)
          const result = await contract.methods.sendGifts(
          list
          ).send({
            from : address,
            gas: estemated_Gas,
            maxPriorityFeePerGas: null,
            maxFeePerGas: null
          })
        }
        catch(e){
          console.log(e);
        }
         // await contract.methods.tokenByIndex(i).call();
        }
  
    }
    return (
        <>
     
        <button onClick={add_prelist}> Add Prelist </button>
                                       
        </>
    )
}