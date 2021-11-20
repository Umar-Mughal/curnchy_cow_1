import Head from 'next/head'
import Script from 'next/script'
import '../styles/Home.module.css'
import Web3 from "web3";
import Router from 'next/router';
import React, { useEffect, useState } from "react";
import Web3Modal from "web3modal";
import { contract_address, contract_abi, speedy_nodes, analytics, pre_1_package_price, pre_2_package_price, pre_3_package_price, pub_1_package_price, pub_2_package_price, pub_3_package_price} from '../config';

export default function Home() {
  let [totalminted, setminted] = useState(0);
  let totalmint;
  let [connectbtnclass, setconnectbtnclass] = useState('connect-btn');
  let [persalestatus, setpresalestatus] = useState('-');
  let [cowpackage, setcowpackage] = useState(0);
  let [walletText, setwalletText] = useState('Wallet');
  let [percow1, setpercow1] = useState('-');
  let [percow2, setpercow2] = useState('-');
  let [percow3, setpercow3] = useState('-');
  let [scroll, setScroll] = useState('');
  let [totalprice_display, settotalprice_display] = useState('-');
  let [presale_total, setpre_sale_total] = useState(0);
  let [mintingstatus, setmintingstatus] = useState('');
  let pre_sale_1_package_price=0;
  let pre_sale_2_package_price=0;
  let pre_sale_3_package_price=0;
  let public_sale_1_package_price=0;
  let public_sale_2_package_price=0;
  let public_sale_3_package_price=0;
  let [maxsupply, setmaxsupply] = useState('-');
  let prep;
 
  const main = () => {
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 10) {
        setScroll('sticky')
      } else {
        setScroll('')
      }
    })
  }
 
  useEffect(() => {
    //   connect_wallet()
    main()
      fetch_data()
    }, [])

    async function fetch_data(){
        
            const web3 = new Web3(speedy_nodes);
            const contract = new web3.eth.Contract(contract_abi, contract_address);
            //await Web3.givenProvider.enable()
          
               
                 
                    contract.methods.presale_total().call((err,result) => {
                      setpre_sale_total(result);
                      prep=result;
                      console.log("result of total pre sale"+result);
                            contract.methods.pre_sale_status().call((err,check) => {
                            console.log("preeeep: "+prep +"result="+result);
                            if(check==true){
                              console.log("prepreeeep: "+prep +"result="+result);
                                setpresalestatus("Pre-Sale Active!")
                                setpercow1(pre_1_package_price);
                                setpercow2(pre_2_package_price);
                                setpercow3(pre_3_package_price);
                            }
                            else{
                              console.log("overpreeeep: "+prep +"result="+result);
                              setpresalestatus("Mint Now!")
                              setpercow1(pub_1_package_price);
                              setpercow2(pub_2_package_price);
                              setpercow3(pub_3_package_price);
                            }
                        });
                        contract.methods.maxSupply().call((err,result) => {
                          setmaxsupply(result)
                          
                            
                        });
                        contract.methods.totalSupply().call((err,result) => {
                           setminted(result);
                           totalmint=result;
                          
                            
                        });

          });
         
           
           
           
            console.log("v2");

        


    }

    async function connect_wallet(){
      
      if(Web3.givenProvider){
      
        const providerOptions = {
          /* See Provider Options Section */
         
        }
        
        console.log("ana: "+analytics);
        
        let web3Modal = new Web3Modal({
          method: 'wallet_requestPermissions',
          network: "mainnet", // optional
          cacheProvider: true, // optional
          providerOptions // required
        });
        
         let provider = await web3Modal.connect();
        let web3 = new Web3(provider);
  
        web3.eth.net.getId().then((result) => { 
      
        console.log("Network id: "+result)
        setwalletText("Connected");
        setconnectbtnclass("connect-btn-mint");

        if(result !== 1){
            alert("Wrong Network Selected. Select Ethereum Network");              
          }
          
        })
  
      }else{
        alert("Web3 Not Found");
        //setwalletText("Connected");
      }
      
    }
 
    async function set_price_package(a, b, presalevalue){
      setcowpackage(a);
      console.log("cowpackage_number" + a);
      console.log("cowpackage_price" + b);
    
     
      if(totalminted<maxsupply){
        if(totalminted<presalevalue){
          console.log("pre_sale_1_package_price" + a);
          console.log("pre_sale_2_package_price" + b);
          console.log("cowpackage_totalmax" + presalevalue);
        
        if(a==1){settotalprice_display(b);}
        if(a==2){settotalprice_display(b);}
        if(a==3){settotalprice_display(b);}
        }
        else{
          if(a==1){settotalprice_display(b);}
          if(a==2){settotalprice_display(b);}
          if(a==3){settotalprice_display(b);}
        }
      }
    }
  async function _mint(a,b, c){
    const web3 = new Web3(speedy_nodes);
    const contract = new web3.eth.Contract(contract_abi, contract_address);
    console.log("cowoackage _mint "+a);
    console.log("presale_total_mint "+b);
    console.log("cowtotal_price_mint "+c);
    contract.methods.pre_sale_status().call((err,check) => {
    console.log("checking:"+check);
    if(check==true){
    if(a==1){mint_presale(web3.utils.toWei(c.toString()),1);}
    if(a==2){
      
      console.log("c value="+c);
    
      mint_presale(web3.utils.toWei(c.toString()),2);}
    if(a==3){
      
      console.log("c value 2="+c);
      mint_presale(web3.utils.toWei(c.toString()),3);}
    }
    else{
      if(a==1){mint_nft(web3.utils.toWei(c.toString()),1);}
      if(a==2){
      
        mint_nft(web3.utils.toWei(c.toString()),2);}
      if(a==3){
   
        mint_nft(web3.utils.toWei(c.toString()),3);}
    }
  });
  }
  async function show_error_alert(error){
    let temp_error = error.message.toString();
    console.log(temp_error);
    let error_list = [
      "It's not time yet",
      "Sent Amount Wrong",
      "Max Supply Reached",
      "You have already Claimed Free Nft.",
      "Presale have not started yet.",
      "Presale Ended.",
      "You are not Whitelisted.",
      "Sent Amount Not Enough",
      "Max 20 Allowed.",
      "Sale Paused",
      "insufficient funds",
      "Wallet limit Reached"
    ]
  
    for(let i=0;i<error_list.length;i++){
      if(temp_error.includes(error_list[i])){
       // set ("Transcation Failed")
        setmintingstatus(error_list[i]);
      }
    }
  }
  async function mint_presale(price,num){

    if(Web3.givenProvider ){ 
      const web3 = new Web3(Web3.givenProvider);
      await Web3.givenProvider.enable();
      const contract = new web3.eth.Contract(contract_abi, contract_address);
      const addresses = await web3.eth.getAccounts()
      const address = addresses[0]
      console.log("addresses[0]: "+addresses[0]);
      setmintingstatus("Minting in progress. Please wait 1 min. Check your wallet in 15-20 mins to confirm transaction.");
      try {
      const estemated_Gas = await contract.methods.buy_presale(num).estimateGas({
        from : address, 
        value: price,
        maxPriorityFeePerGas: null,
        maxFeePerGas: null
      });
    
        const result = await contract.methods.buy_presale(num).send({
          from : address, 
          value: price,
          gas: estemated_Gas,
          maxPriorityFeePerGas: null,
          maxFeePerGas: null})
          setmintingstatus(cowpackage+" Cows Minted Successfully!");
      } catch (error) {
        show_error_alert(error)
      }
     
    
    }
 
}
async function mint_nft(price,num){

  if(Web3.givenProvider ){ 

    const web3 = new Web3(Web3.givenProvider);
    await Web3.givenProvider.enable()
    const contract = new web3.eth.Contract(contract_abi, contract_address);

    const addresses = await web3.eth.getAccounts()
    const address = addresses[0]
    console.log("addresses[0]: "+addresses[0])
    setmintingstatus("Minting in progress...");
    try {
    const estemated_Gas = await contract.methods.buy(num).estimateGas({
      from : address, 
      value: price,
      maxPriorityFeePerGas: null,
      maxFeePerGas: null
    });
    
      const result = await contract.methods.buy(num).send({
        from : address, 
        value: price,
        gas: estemated_Gas,
        maxPriorityFeePerGas: null,
        maxFeePerGas: null})
        setmintingstatus(cowpackage+" Cows Minted Successfully!");
    } catch (error) {
      show_error_alert(error)
    }

  }

}

  return (
    <div>
      <Head>
        <title>CrunchyCows</title>
        <meta name="description" content="Generated by create next app" />
        <link href="img/CC-favicon.png" type="image/png" rel="icon"/>
     </Head>
    
<body>
      
      
      
      <header className={scroll}>
      <div className="container">
            <div className="row">
                <div className="col-md-4 col-sm-6 col-8 text-left">
                    <div className="logo">
                        <a href="#">
                            <img src="img/logo.png" alt=""/>
                        </a>
                    </div>
                 
                </div>
                <div className="col-md-8 col-sm-6 col-4 d-flex align-items-center justify-content-end">

                    <div className="mobile-menu d-flex align-items-center">
                       
                        <ul id="menu">
                          
                           
                            
                            
                        </ul>
                    
                        <div className="d-inline-flex align-items-center">
                            <a onClick={()=>connect_wallet()} className="wallet-btn" href="#">{walletText}</a>
                            <a className="nouka-icon" href="https://opensea.io/collection/crunchy-cows"><img src="img/nouka-icon.png" alt=""/></a> 
                        </div>
                    </div>
                    

                    <div className="hamburger-menu">
                        <span className="line-top"></span>
                        <span className="line-center"></span>
                        <span className="line-bottom"></span>
                    </div>

                </div>
            </div>
        </div>

         </header>
      
  {/* home area start */}

  {/* home area end */}
  {/* pre sale area start */}
 
  {/* pre sale area end */}
  {/* collect currency area start */}
  <div className="collect-currency-wrapper" style={{backgroundImage: 'url(./img/collect-currency-bg.png)'}}>
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-12 text-center">
          <h2 className="collect-head" id="collect-head">Collect Crunchy Cows</h2>
          <p className="collect-head" id="collect-head">{persalestatus}&nbsp;&nbsp;</p>
        </div>
        <div className="col-lg-4 col-md-6 col-sm-6">
          <div className="collect-box mt_30 text-center">
            <img className="collect-img" src="img/collect-img-01.png" alt="" />
            <h3 className="mt_10">Single Serving</h3>
            <p className="color-one mt_10">1 Cow</p>
            <p className="mt_10">{percow1} ETH</p>
          
            <button data-toggle="modal" onClick={() =>set_price_package(1,percow1,presale_total)} data-target="#mintModal" href={maxsupply}  className="mint-btn mt_30" type="button" > MINT</button>
          
          </div>
        </div>
        <div className="col-lg-4 col-md-6 col-sm-6">
          <div className="collect-box mt_30 text-center">
            <img className="collect-img" src="img/collect-img-02.png" alt="" />
            <h3 className="mt_10">Combo</h3>
            <p className="color-one mt_10">2 Cows</p>
            <p className="mt_10">{percow2} ETH</p>
            <button data-toggle="modal" onClick={() =>set_price_package(2,percow2,presale_total)} data-target="#mintModal" className="mint-btn mt_30" type="button">MINT</button>
          </div>
        </div>
        <div className="col-lg-4 col-md-6 col-sm-6">
          <div className="collect-box mt_30 text-center">
            <img className="collect-img" src="img/collect-img-03.png" alt="" />
            <h3 className="mt_10">Super Sized</h3>
            <p className="color-one mt_10">3 Cows</p>
            <p className="mt_10">{percow3} ETH</p>
            <button data-toggle="modal" onClick={() =>set_price_package(3,percow3,presale_total)} data-target="#mintModal" className="mint-btn mt_30" type="button">MINT</button>
          </div>
        </div>
        <div className="col-12 text-center">
         
        </div>
      </div>
    </div>
  </div>
  {/* collect currency area end */}
  {/* perks area start */}

  {/* perks area end */}
  {/* rare area start */}

  {/* rare area end */}
  {/* road map area start */}
 
  {/* road map area end */}
  {/* who make area start */}
 
  {/* who make area end */}
  {/* meet gallery area start */}
 
  {/* meet gallery area end */}
  {/* faq area start */}
 
  {/* faq area end */}
  {/* footer area start */}
  <footer className="position-relative">
    <img className="footer-shape position-absolute" src="img/footer-shape.png" alt="" />
    <div className="container">
      <div className="row align-items-end">
        <div className="col-xl-6 col-lg-7 col-md-6 footer-logo-custom">
          <div>
            <a className="footer-logo" href="#"><img src="img/footer-logo.png" alt="" /></a>
            <div className="footer-content d-flex align-items-center">
              <p>All Rights Reserved © 2021 </p>
            </div>
          </div>
        </div>
        <div className="col-xl-6 col-lg-5 col-md-6 footer-logo-custom">
          <div className="footer-social text-right">
            <a href="https://twitter.com/crunchycows"><i className="fab fa-twitter" /></a>
          </div>
        </div>
      </div>
    </div>
  </footer>
  {/* footer area end */}
  {/* collect currency area start */}

  <div className="modal first-modal fade" id="mintModal" tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
         <div className="modal-content">
            <div className="modal-header-shape">
               <img className="w-100" src="img/modal-header.png" alt=""/>
               <h2>COLLECT CRUNCHY COWS</h2>
               <span id='mint-modal-close-btn' className="close" data-dismiss="modal"></span>
            </div>
            <div></div>
            <div className="modal-body">
               <h2>
                  Total cost= <span id="cost"> {totalprice_display}</span>ETH
               </h2>
               <h4 className="hour-text"></h4>
                  <div className="d-flex p-2 align-items-center mt_30 wd50 center jus">
                     <h2 className="mr_10">COWS</h2>
                     <div>
                       <input type="text" id="cow-count" className="input-info" placeholder="0" value={cowpackage} />
                       </div>
                  </div>
               <div className="text-center mt_30"><button onClick={()=>connect_wallet()} className={connectbtnclass}>{walletText}</button><span className="connect-border"></span>
               <button onClick={()=> _mint(cowpackage,presale_total,totalprice_display)} className="connect-btn mint-popup-button">MINT</button></div>
               <p id="start-mint-text">{mintingstatus}</p>
            </div>
         </div>
      </div>
   </div>

  <div className="modal first-modal fade" id="mintIsDoneModal" tabIndex="-1" aria-hidden="true">
         <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
               <div className="modal-header-shape">
                  <img className="w-100" src="img/modal-header.png" alt=""/>
                  <h2>SUCCESS!</h2>
                  <span id='mint-modal-close-btn' className="close" data-dismiss="modal"></span>
               </div>
               <div></div>
               <div className="modal-body">
                  <h2> You Minted: </h2>
                 <h2 id="total-minted-count"></h2>
               </div>
            </div>
         </div>
      </div>






  
    <Script src="js/jquery-3.4.1.min.js"></Script>
    <Script src="js/plugins.js"></Script>
    <Script src="js/jquery.magnific-popup.min.js"></Script>
    <Script src="js/main.js"></Script> 
    <Script src="https://unpkg.com/sweetalert/dist/sweetalert.min.js"></Script>
  </body>
  
 </div>
)

        }