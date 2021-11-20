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
      if (window.pageYOffset > 150) {
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
              contract.methods.three_package().call((err,result) => {
                public_sale_3_package_price=result;
                contract.methods.two_package().call((err,result) => {
                  public_sale_2_package_price=result;
                  contract.methods.one_package().call((err,result) => {
                    public_sale_1_package_price=result;
                    contract.methods.presale_total().call((err,result) => {
                      setpre_sale_total(result);
                      prep=result;
                      console.log("result of total pre sale"+result);
                      contract.methods.pre_three_package().call((err,result) => {
                        pre_sale_3_package_price=result;
                        contract.methods.pre_two_package().call((err,result) => {
                          pre_sale_2_package_price=result;
                          contract.methods.pre_one_package().call((err,result) => {
                            pre_sale_1_package_price = result;
                            contract.methods.pre_sale_status().call((err,check) => {
                           
                            console.log("preeeep: "+prep +"result="+result);
                           
                            if(check==true){
                              console.log("prepreeeep: "+prep +"result="+result);
                                setpresalestatus("Pre-Sale Active!")
                                setpercow1(pre_1_package_price);
                                setpercow2(pre_2_package_price/2);
                                setpercow3(pre_3_package_price/3);
                                
                            }
                            else{
                              console.log("overpreeeep: "+prep +"result="+result);
                              setpresalestatus("Pre-Sale is Over!")
                              setpercow1(pub_1_package_price);
                              setpercow2(pub_2_package_price/2);
                              setpercow3(pub_3_package_price/3);
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
                    });
                  });
                });
              });
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

        if(result !== 4){
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
    if(check==true){
    if(a==1){mint_presale(web3.utils.toWei(c.toString()),1);}
    if(a==2){
      c=c*2;
      console.log("c value="+c);
    
      mint_presale(web3.utils.toWei(c.toString()),2);}
    if(a==3){
      c=c*3;
      console.log("c value 2="+c);
      mint_presale(web3.utils.toWei(c.toString()),3);}
    }
    else{
      if(a==1){mint_nft(web3.utils.toWei(c.toString()),1);}
      if(a==2){
        c=c*2;
        mint_nft(web3.utils.toWei(c.toString()),2);}
      if(a==3){
        c=c*3;
        mint_nft(web3.utils.toWei(c.toString()),3);}
    }
  });
  }
  async function mint_presale(price,num){

    if(Web3.givenProvider ){ 
      const web3 = new Web3(Web3.givenProvider);
      await Web3.givenProvider.enable();
      const contract = new web3.eth.Contract(contract_abi, contract_address);
      const addresses = await web3.eth.getAccounts()
      const address = addresses[0]
      console.log("addresses[0]: "+addresses[0])
      const estemated_Gas = await contract.methods.buy_presale(num).estimateGas({
        from : address, 
        value: price,
        maxPriorityFeePerGas: null,
        maxFeePerGas: null
      });
      const result = await contract.methods.buy_presale(num).send({from : address, value: price, gas: estemated_Gas,
        maxPriorityFeePerGas: null,
        maxFeePerGas: null})
     alert(cowpackage+" Cows Minted!");
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
    const estemated_Gas = await contract.methods.buy(num).estimateGas({
      from : address, 
      value: price,
      maxPriorityFeePerGas: null,
      maxFeePerGas: null
    });
    const result = await contract.methods.buy(num).send({from : address, value: price, gas: estemated_Gas,
      maxPriorityFeePerGas: null,
      maxFeePerGas: null})

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
                            <li className="nav-item">
                                <a href="#collect-head" className="nav-link">Collect Cows</a>
                            </li>
                            <li className="nav-item">
                                <a href="#rare-box" className="nav-link menu_link" >Rare</a>
                            </li>
                            <li className="nav-item">
                                <a href="#text-center" className="nav-link menu_link">FAQ</a>
                            </li>
                            
                        </ul>
                    
                        <div className="d-inline-flex align-items-center">
                            <a onClick={()=>connect_wallet()} className="wallet-btn" href="#">{walletText}</a>
                            <a className="nouka-icon" href="https://opensea.io/collection/crunchycows"><img src="img/nouka-icon.png" alt=""/></a> 
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
  <div className="home-wrapper" style={{backgroundImage: 'url(./img/home-bgs.png)'}}>
    <img className="home-shape-two position-absolute" src="img/home-shape-two.png" alt="" />
    <img className="home-shape-bg position-absolute" src="img/home-shape-bg.png" alt="" />
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-lg-12 home-content-ab">
          <div className="home-content">
            <div className="d-flex align-items-center">
              <img className="home-cow" src="img/home-cow.png" alt="" />
              <div>
              
                <p>Crunchy Cows are a collection of <br /> 9,999 fun loving, food chomping NFT <br /> friends, cruising on the Ethereum <br /> block chain.</p>
                <p className="mt_custom">Collect some cows and come on <br /> down to the Cow Club!</p>
                <span className="moo-text">-Moo
                </span>
                
              </div>
            </div>
            <div className="d-flex">
                            <a className="twitter-bg-new social-btn-new" href="https://twitter.com/crunchycows">
                              <img src="img/twitter-logo.png" alt="" />Twitter</a>
                            <a className="social-btn-new discord-bg" href="https://discord.gg/w8XejnBx">
                              <img src="img/discord-icon.png" alt="" />Discord</a>
                            <a className="buy-bg social-btn-new" href="#">Buy</a>
                        </div>


          </div>
        </div>
      </div>
    </div>
  </div>
  {/* home area end */}
  {/* pre sale area start */}
  <div className="pre-wrapper" style={{backgroundImage: 'url(./img/pre-sale-bg.png)'}}>
    <div className="container">
      <div className="row">
        <div className="col-12">
          <div className="pre-box text-center">
            <h2>CRUNCHY COW MOOS (NEWS)</h2>
            <h4>Be the first to get updates, news, and drop info.</h4>
            <div className="search-box">
              <input type="text" placeholder="Enter Your Email" />
              <button type="button" className="sign-btn">SIGN Me Up</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
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
            <p className="mt_10">{percow1} ETH per Cow</p>
          
            <button data-toggle="modal" onClick={() =>set_price_package(1,percow1,presale_total)} data-target="#exampleModal" href={maxsupply}  className="mint-btn mt_30" type="button" > MINT</button>
          
          </div>
        </div>
        <div className="col-lg-4 col-md-6 col-sm-6">
          <div className="collect-box mt_30 text-center">
            <img className="collect-img" src="img/collect-img-02.png" alt="" />
            <h3 className="mt_10">Combo</h3>
            <p className="color-one mt_10">2 Cow</p>
            <p className="mt_10">{percow2} ETH per Cow</p>
            <button data-toggle="modal" onClick={() =>set_price_package(2,percow2,presale_total)} data-target="#exampleModal" className="mint-btn mt_30" type="button">MINT</button>
          </div>
        </div>
        <div className="col-lg-4 col-md-6 col-sm-6">
          <div className="collect-box mt_30 text-center">
            <img className="collect-img" src="img/collect-img-03.png" alt="" />
            <h3 className="mt_10">Super Sized</h3>
            <p className="color-one mt_10">3 Cow</p>
            <p className="mt_10">{percow3} ETH per Cow</p>
            <button data-toggle="modal" onClick={() =>set_price_package(3,percow3,presale_total)} data-target="#exampleModal" className="mint-btn mt_30" type="button">MINT</button>
          </div>
        </div>
        <div className="col-12 text-center">
          <a className="opensa-btn" href="https://opensea.io/collection/crunchycows">Opensea</a>
        </div>
      </div>
    </div>
  </div>
  {/* collect currency area end */}
  {/* perks area start */}
  <div className="perks-wrapper position-relative">
        <img className="perk-shape-01 position-absolute" src="img/perk-shape-01.svg" alt=""/>
        <img className="perk-shape-02 position-absolute" src="img/perk-shape-02.svg" alt=""/>
        <img className="perk-shape-03 position-absolute" src="img/perk-shape-03.svg" alt=""/>
        <img className="perk-shape-04 position-absolute" src="img/perk-shape-04.svg" alt=""/>
        <img className="perk-shape-05 position-absolute" src="img/perk-shape-05.svg" alt=""/>
        <img className="perk-shape-06 position-absolute" src="img/perk-shape-06.svg" alt=""/>
        <img className="perk-shape-07 position-absolute" src="img/perk-shape-07.svg" alt=""/>
        <img className="perk-shape-08 position-absolute" src="img/perk-shape-08.svg" alt=""/>
        <img className="perk-shape-09 position-absolute" src="img/perk-shape-09.svg" alt=""/>
        <img className="perk-shape-10 position-absolute" src="img/perk-shape-10.svg" alt=""/>
        <img className="perk-shape-11 position-absolute" src="img/perk-shape-11.svg" alt=""/>
        <img className="perk-shape-12 position-absolute" src="img/perk-shape-12.svg" alt=""/>
        <div className="container">
            <div className="row">
                <div className="col-12">
                    <div>
                        <div className="text-center">
                            <h2 className="collect-head perks-head">PERKS</h2>
                        </div>
                        <ul className="park-box">
                            <li><img src="img/tick-icon.svg" alt=""/><p>Crunchy Cow Country Club Access (2022)</p></li>
                            <li><img src="img/tick-icon.svg" alt=""/><p>Owners eligible to get air-dropped custom cows</p></li>
                            <li><img src="img/tick-icon.svg" alt=""/><p>First dibs on pre-sale of Mad/Happy Crunchy Cows and Crunchy Cow Friends in the future</p></li>
                            <li><img src="img/tick-icon.svg" alt=""/><p>Cow Card</p></li>
                            <li><img src="img/tick-icon.svg" alt=""/><p>Crunchy Cow Investor & Launch Updates</p></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
  {/* perks area end */}
  {/* rare area start */}
  <div className="rare-wrapper" style={{backgroundImage: 'url(./img/rare-bg.png)'}}>
        <div className="container">
            <div className="rare-box">
                <div className="row">
                    <div className="col-12 text-center">
                        <h2 className="collect-head rare-head" id="rare-box">RARE</h2>
                    </div>
                    <div className="col-lg-6 col-md-6">
                        <div className="text-center">
                            <div className="toltip-box">
                                <img className="tolitp-shape position-absolute" src="img/tolitp-shape.png" alt=""/>
                                <p>Could we use a different<br/> word other than rare?</p>
                            </div>
                            <img className="rare-cow-img" src="img/rare-cow-img.png" alt=""/>
                        </div>
                    </div>
                    <div className="col-lg-6 col-md-6">
                        <div className="table-make">
                            <table>
                                <tr className="border-bottom-table">
                                    <td>
                                        <p className="table-first-text mb_10">TOTAL COWS</p>
                                    </td>
                                    <td className="text-left">
                                        <h5 className="table-second-text mb_10">9,999</h5>
                                    </td>
                                </tr>
                                <tr className="border-bottom-table">
                                    <td>
                                        <p className="table-first-text mt_20 mb_10">Generated</p>
                                    </td>
                                    <td className="text-left">
                                        <h5 className="table-second-text mt_20 mb_10">{totalminted}</h5>
                                    </td>
                                </tr>
                                <tr className="border-bottom-table">
                                    <td>
                                        <p className="table-first-text mt_20 mb_10">Custom (Originals)</p>
                                    </td>
                                    <td className="text-left">
                                        <h5 className="table-second-text mt_20 mb_10">300</h5>
                                    </td>
                                </tr>
                                <tr className="border-bottom-table">
                                    <td>
                                        <p className="table-first-text mt_20 mb_10">Super Rare&nbsp;</p>
                                    </td>
                                    <td className="text-left">
                                        <h5 className="table-second-text mt_20 mb_10">2%</h5>
                                    </td>
                                </tr>
                                <tr className="border-bottom-table">
                                    <td>
                                        <p className="table-first-text mt_20 mb_10">Rare</p>
                                    </td>
                                    <td className="text-left">
                                        <h5 className="table-second-text mt_20 mb_10">8%</h5>
                                    </td>
                                </tr>
                                <tr className="border-bottom-table">
                                    <td>
                                        <p className="table-first-text mt_20 mb_10">Uncommon&nbsp;</p>
                                    </td>
                                    <td className="text-left">
                                        <h5 className="table-second-text mt_20 mb_10">25%</h5>
                                    </td>
                                </tr>
                                <tr className="border-bottom-table border-table-last">
                                    <td>
                                        <p className="table-first-text mt_30 mb_10">Common</p>
                                    </td>
                                    <td className="text-left vertical-text">
                                        <h5 className="table-second-text mt_30 mb_10">65%</h5>
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  {/* rare area end */}
  {/* road map area start */}
  <div className="road-map-wrapper position-relative">
    <div className="container">
      <div className="row">
        <div className="col-12 position-relative text-center">
          <h2 className="collect-head text-white road-map-head">Road Map</h2>
          <img className="road-map-img" src="img/road-map-img.png" alt="" />
          <div className="road-map-ab">
            <h3 className="road-percent">10%</h3>
            <p className="road-map-para road-map-ab-1">10 Airdrops <br /> For Every 1000 <br /> Cows Minted</p>
          </div>
          <div className="road-map-ab">
            <h3 className="road-percent">20%</h3>
            <p className="road-map-para road-map-ab-2">$5k Donation Made +<br /> Donation Parters<br /> Announced </p>
          </div>
          <div className="road-map-ab">
            <h3 className="road-percent">30%</h3>
            <p className="road-map-para road-map-ab-3">10 Fresh <br />Air-Drops to<br />Random Cow <br />Owners</p>
          </div>
          <div className="road-map-ab">
            <h3 className="road-percent">50%</h3>
            <div className="road-map-ab-4">
              <p className="road-map-para">Crunchy Cow<br />Country Club Opened</p>
            
            </div>
          </div>
          <div className="road-map-ab">
            <h3 className="road-percent">75%</h3>
            <div className="road-map-ab-5">
              <p className="road-map-para">50 Fresh Airdrops<br />on Cow Owner&apos;s Heads</p>
              <p className="road-map-para mt_20">Crunchy Cow<br />Merch and Cartoon <br />Announcements</p>
            </div>
          </div>
          <div className="road-map-ab">
            <h3 className="road-percent">100%</h3>
            <p className="road-map-para road-map-ab-6">Moo-ning Soon!
</p>
          </div>
        </div>
        <div className="col-12">
          <p className="road-map-last-para">Mad Crunchy Cows, Happy Crunchy Cows, Crunchy Cow Friends<br /> And so moo-ch more.</p>
        </div>
      </div>
    </div>
  </div>
  {/* road map area end */}
  {/* who make area start */}
  <div className="who-make-wrapper" style={{backgroundImage: 'url(./img/who-make-bg.png)'}}>
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-12 text-center">
          <h2 className="collect-head who-make-head">WHO Makes These Cows?</h2>
        </div>
        <div className="col-lg-3 col-md-4 col-sm-6">
          <div className="who-make-box mt_30 text-center">
            <img className="w-100" src="img/who-make-01.png" alt="" />
            <h2 className="mt_25">Cow Creator</h2>
            <p>From toys, to music videos, to books,  Ryan Maloney has been creating for a looong time. Crunchy Cows is his 2nd official NFT line. Say hello:&nbsp;&nbsp; </p>
            <a className="mt_15" href="https://www.tiktok.com/@ryryart?"><img src="img/tiktok-icon.svg" alt="" /> @ryryart</a>
          </div>
        </div>
        <div className="col-12 text-center">
          <h2 className="collect-head meet-bros-text text-white">Meet The Moo’s </h2>
        </div>
      </div>
    </div>
  </div>
  {/* who make area end */}
  {/* meet gallery area start */}
  <div className="meet-gallery-wrapper">
    <div className="container-fluid">
      <div className="popup-gallery row no-gutters custom_grid">
        <div className="col">
          <a href="img/gallery-one-01.png" className="gallery-img position-relative">
            <img className="w-100" src="img/gallery-one-01.png" alt="" />
          </a>
        </div>
        <div className="col">
          <a href="img/gallery-one-02.png" className="gallery-img position-relative">
            <img className="w-100" src="img/gallery-one-02.png" alt="" />
          </a>
        </div>
        <div className="col">
          <a href="img/gallery-one-03.png" className="gallery-img position-relative">
            <img className="w-100" src="img/gallery-one-03.png" alt="" />
          </a>
        </div>
        <div className="col">
          <a href="img/gallery-one-04.png" className="gallery-img position-relative">
            <img className="w-100" src="img/gallery-one-04.png" alt="" />
          </a>
        </div>
        <div className="col">
          <a href="img/gallery-one-05.png" className="gallery-img position-relative">
            <img className="w-100" src="img/gallery-one-05.png" alt="" />
          </a>
        </div>
        <div className="col">
          <a href="img/gallery-one-06.png" className="gallery-img position-relative">
            <img className="w-100" src="img/gallery-one-06.png" alt="" />
          </a>
        </div>
        <div className="col">
          <a href="img/gallery-one-07.png" className="gallery-img position-relative">
            <img className="w-100" src="img/gallery-one-07.png" alt="" />
          </a>
        </div>
        <div className="col">
          <a href="img/gallery-one-08.png" className="gallery-img position-relative">
            <img className="w-100" src="img/gallery-one-08.png" alt="" />
          </a>
        </div>
        <div className="col">
          <a href="img/gallery-one-09.png" className="gallery-img position-relative">
            <img className="w-100" src="img/gallery-one-09.png" alt="" />
          </a>
        </div>
        <div className="col">
          <a href="img/gallery-one-10.png" className="gallery-img position-relative">
            <img className="w-100" src="img/gallery-one-10.png" alt="" />
          </a>
        </div>
        <div className="col">
          <a href="img/gallery-one-11.png" className="gallery-img position-relative">
            <img className="w-100" src="img/gallery-one-11.png" alt="" />
          </a>
        </div>
        <div className="col">
          <a href="img/gallery-one-12.png" className="gallery-img position-relative">
            <img className="w-100" src="img/gallery-one-12.png" alt="" />
          </a>
        </div>
        <div className="col">
          <a href="img/gallery-one-13.png" className="gallery-img position-relative">
            <img className="w-100" src="img/gallery-one-13.png" alt="" />
          </a>
        </div>
        <div className="col">
          <a href="img/gallery-one-14.png" className="gallery-img position-relative">
            <img className="w-100" src="img/gallery-one-14.png" alt="" />
          </a>
        </div>
        <div className="col">
          <a href="img/gallery-one-15.png" className="gallery-img position-relative">
            <img className="w-100" src="img/gallery-one-15.png" alt="" />
          </a>
        </div>
        <div className="col">
          <a href="img/gallery-one-16.png" className="gallery-img position-relative">
            <img className="w-100" src="img/gallery-one-16.png" alt="" />
          </a>
        </div>
        <div className="col">
          <a href="img/gallery-one-17.png" className="gallery-img position-relative">
            <img className="w-100" src="img/gallery-one-17.png" alt="" />
          </a>
        </div>
        <div className="col">
          <a href="img/gallery-one-18.png" className="gallery-img position-relative">
            <img className="w-100" src="img/gallery-one-18.png" alt="" />
          </a>
        </div>
      </div>
    </div>
  </div>
  {/* meet gallery area end */}
  {/* faq area start */}
  <div className="faw-wrapper position-relative" style={{backgroundImage: 'url(./img/faq-bg.png)'}}>
    <div className="container">
      <div className="row">
        <div className="col-12 text-center" id="text-center">
          <a className="view-btn" href="https://opensea.io/collection/crunchycows">View On Opensea</a>
          <h2 className="collect-head faq-head">Faq</h2>
        </div>
        <div className="col-12">
          <div className="accordion" id="accordionExample">
            <div className="card mt_30">
              <div className="card-header" id="headingOne">
                <h2 className="mb-0" data-toggle="collapse" data-target="#collapseOne" aria-controls="collapseOne">Where can I buy Crunchy Cows?&nbsp; &nbsp; &nbsp;</h2>
              </div>
              <div id="collapseOne" className="collapse show" aria-labelledby="headingOne" data-parent="#accordionExample">
                <div className="card-body">
                Pre-sale: CrunchyCows.com. Public sale: Opensea.io.    &nbsp; &nbsp; </div>
              </div>
            </div>
            <div className="card mt_40">
              <div className="card-header" id="headingtwo">
                <h2 className="mb-0" data-toggle="collapse" data-target="#collapsetwo" aria-controls="collapseOne">How do I get Pre-Sale Access?</h2>
              </div>
              <div id="collapsetwo" className="collapse" aria-labelledby="headingtwo" data-parent="#accordionExample">
                <div className="card-body">
                Sign up for the email list above or join the Discord. 
                </div>
              </div>
            </div>
            <div className="card mt_40">
              <div className="card-header" id="headingthree">
                <h2 className="mb-0" data-toggle="collapse" data-target="#collapsethree" aria-expanded="true" aria-controls="collapseOne">What Will The Mint Price Be? </h2>
              </div>
              <div id="collapsethree" className="collapse" aria-labelledby="headingthree" data-parent="#accordionExample">
                <div className="card-body">
                TBD. Join the discord to chat about it.
                </div>
              </div>
            </div>
            <div className="card mt_40">
              <div className="card-header" id="headingfour">
                <h2 className="mb-0" data-toggle="collapse" data-target="#collapsefour" aria-expanded="true" aria-controls="collapsefour">I&apos;ve Never Bought An NFT, How Do I Do It?&nbsp;</h2>
              </div>
              <div id="collapsefour" className="collapse" aria-labelledby="headingfour" data-parent="#accordionExample">
                <div className="card-body">
                Download Metamask.io. You&apos;ll need to transfer Ethereum into Metamask from another wallet (Coinbase for example). Then go on Opensea, connect your Metamask wallet and buy away!
                </div>
              </div>
            </div>
            <div className="card mt_40">
              <div className="card-header" id="headingfive">
                <h2 className="mb-0" data-toggle="collapse" data-target="#collapsefive" aria-expanded="true" aria-controls="collapsefive">i&apos;ve never bought an nFT, how do I do it?</h2>
              </div>
              <div id="collapsefive" className="collapse" aria-labelledby="headingfive" data-parent="#accordionExample">
                <div className="card-body">
                  Download Metamask.io. You&apos;ll need to transfer Ethereum into Metamask from another wallet (Coinbase for example). Then go on Opensea, connect your Metamask wallet and buy away!
                </div>
              </div>
            </div>
            <div className="card mt_40">
              <div className="card-header" id="headingsix">
                <h2 className="mb-0" data-toggle="collapse" data-target="#collapsesix" aria-expanded="true" aria-controls="collapsesix">Can You Send Me A Free Crunchy Cow?</h2>
              </div>
              <div id="collapsesix" className="collapse" aria-labelledby="headingsix" data-parent="#accordionExample">
                <div className="card-body">
                Sorry, but that&apos;s not possible. If you would like a chance to get airdropped a cow, buy 1 and sign up for the mailing list or discord to be notified when we&apos;ve hit a milestone. </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
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
  <div className="modal first-modal fade" id="exampleModal" tabIndex={-1} aria-hidden="true">
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="modal-header-shape">
          <img className="w-100" src="img/modal-header.png" alt="" />
          <h2>COLLECT CRUNCHY COWS</h2>
          <span className="close" data-dismiss="modal" />
        </div>
        <div>
        </div>
        <div className="modal-body">
          <h2>Per Cow cost= {totalprice_display}ETH</h2>
          <h4 className="hour-text"></h4>
          <center>
          <div className="d-flex p-2 align-items-center mt_30 wd50">
       
            <h2 className="mr_10">COWS</h2>
            <div>
           
              <input className="input-info active" type="text" disabled placeholder={cowpackage} />
             
            </div>
          
          </div>
      </center>
          <div className="text-center mt_30">
            <button onClick={()=>connect_wallet()} className={connectbtnclass} >{walletText}</button>
            <span className="connect-border" />
            <button onClick={()=> _mint(cowpackage,presale_total,totalprice_display)} className="connect-btn">MINT</button>
          </div>
        </div>
      </div>
    </div>
  </div>










  
    <Script src="js/jquery-3.4.1.min.js"></Script>
    <Script src="js/plugins.js"></Script>
    <Script src="js/jquery.magnific-popup.min.js"></Script>
    <Script src="js/main.js"></Script> 
    
  </body>
  
 </div>
)

        }