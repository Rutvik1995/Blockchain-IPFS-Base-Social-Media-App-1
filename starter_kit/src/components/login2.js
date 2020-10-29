import React, { Component } from 'react';
import Web3 from 'web3';
import Meme from '../abis/Meme.json';
import { Button,Card,Form } from "react-bootstrap";


//IPFS
var ipfsClient = require('ipfs-http-client');
var ipfs = ipfsClient({ host: 'localhost', port: '5001', protocol: 'http' })
//var ipfs = ipfsClient({host:'ipfs.infura.io',port:'5001',protocol: 'https' }) ;;
//Crypto
var CryptoJS = require("crypto-js");
var SHA256 = require("crypto-js/sha256");




class login2  extends Component{

      
    constructor(props){
        super(props);
        console.log(props);
        this.state={
          account:'',
          buffer:null,
          contract:null,
          userInformationListFromBlockChain:'',
          userInformationFromIPFS:''
        };       
      }


      async componentWillMount(){
        await this.loadWeb3()
        await this.loadBlockChainData();
      }

  
      async loadWeb3(){
        if(window.ethereum){
          window.web3 =new Web3(window.ethereum);
          await window.ethereum.enable();
        }
        if(window.web3){
          window.web3 = new Web3(window.web3.currentProvider);
        }
        else{
          window.alert("Please use metamask");
        }
    }

      async loadBlockChainData(){
        const web3_2 = window.web3;
        const accounts =  await web3_2.eth.getAccounts();
        this.setState({account:accounts[0]});
        const networkId = await web3_2.eth.net.getId();
        const networkdata= Meme.networks[networkId];
        if(networkdata){
          const abi =Meme.abi;
          const address = networkdata.address;
          //fetch the contract 
          const contract = web3_2.eth.Contract(abi,address);
          console.log(contract);
          this.setState({contract:contract});
          console.log(contract.methods);
        //  const MemeHash =await contract.methods.get().call();

        var tt= await this.state.contract.methods.userCount().call();
          var userCount=await tt;
          for(var i=1;i<=userCount;i++){
            const userInformationListFromBlockChain= await this.state.contract.methods.userInformation(i).call();
            console.log(userInformationListFromBlockChain)
            this.setState({
              userInformationListFromBlockChain:[...this.state.userInformationListFromBlockChain, userInformationListFromBlockChain]
            })

            //console.log(this.state.userInformationListFromBlockChain)
            //ipfs.get("/ipfs/"+userInformationListFromBlockChain.userHash,(error,result)=>{
              console.log(userInformationListFromBlockChain.userId);
              ipfs.files.read("/user/"+userInformationListFromBlockChain.userId+"/userInformationTable",(error,result)=> {
               // console.log(result[0]);
                 var userJsonResult = JSON.parse(result);
              
                 console.log(userJsonResult);
                 this.setState({
                    userInformationFromIPFS:[...this.state.userInformationFromIPFS, userJsonResult]
                  })
            });

          }

        

        }
        else{
          window.alert("Smart contract not deployed to detected the network");
        }
      }

      login=()=>{
         
        var userEmailID=document.getElementById("email").value;
        var password=document.getElementById("password").value;
        var encryptedPassword = CryptoJS.SHA256(password).toString();
        console.log(encryptedPassword);
        var loginCheck=0;
        for(var i=0;i<this.state.userInformationFromIPFS.length;i++){
         
            if(this.state.userInformationFromIPFS[i].emailId==userEmailID){
                console.log("in if");
                if(encryptedPassword==this.state.userInformationFromIPFS[i].encryptedPassword){
                    console.log("done "); 
                    loginCheck=1;  
                   
                    this.props.history.push({
                        pathname: '/mainPage3/'+this.state.userInformationFromIPFS[i].userId,
                        userId:this.state.userInformationFromIPFS[i].userId,
                        fullName: this.state.userInformationFromIPFS[i].fullName,
                        userEmailId:this.state.userInformationFromIPFS[i].emailId,
                        profilePicHash:this.state.userInformationFromIPFS[i].profilePicHash
                      })
                }
            }
        }


      }

      mainPage=()=>{
        this.props.history.push({
          pathname: '/mainPage/',
          data: this.state.currentEmailId,
          name: this.props.location.name   // your data array of objects
        })
      }

      CreateAccountPage=()=>{
         this.props.history.push({
           pathname: '/register2',})
       }
       register=()=>{
        this.props.history.push({
          pathname: '/register2',})
      }
      render(){
        return(
            <div>
<script src="https://code.jquery.com/jquery-3.5.1.slim.min.js" integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js" integrity="sha384-9/reFTGAW83EW2RDu2S0VKaIzap3H66lZH81PoYlFhbGU+6BZp6G7niu735Sk7lN" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/js/bootstrap.min.js" integrity="sha384-w1Q4orYjBQndcko6MimVbzY0tgp4pWB4lZ7lr30WKz0vr/aWKhXdBNmNb5D92v7s" crossorigin="anonymous"></script>
<link rel="stylesheet" href="css/style.css"></link>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css" integrity="sha384-TX8t27EcRE3e/ihU7zmQxVncDAy5uIKz4rEkgIXeMed4M0jlfIDPvg6uqKI2xXr2" crossorigin="anonymous"></link>
                {/* <div className="container">
               
              
                <h1  style={{textAlign:"center",marginLeft:"-290px"}}>Welcome</h1>
                <hr></hr>
               
                
               <div style={{marginRight:"290px", paddingRight:"100px"}}>
                  
                  <Form.Group controlId="formBasicPassword">
                            <br></br>
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email"  id="email"  placeholder="Enter email" />
    </Form.Group>   
    <Form.Group controlId="formBasicPassword">
                            <br></br>
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" id="password" placeholder="Password" />
    </Form.Group>                
    <div className="row">
                            <div className="col-sm-3">
                            <Button variant="primary" size="sm" onClick={this.login}> Login</Button>
                           
                            </div>
                            <div className="col-sm-9">
                            <Button variant="primary" size="sm" onClick={this.register}>Create Account</Button>
                            </div>
                        </div>  

</div>

                {/* <Card.Header as="h5">Login</Card.Header>
                    <Card.Body>
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email"  id="email"  placeholder="Enter email" />   
                        <Form.Group controlId="formBasicPassword">
                            <br></br>
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" id="password" placeholder="Password" />
                        </Form.Group>                               
                        <div className="row">
                            <div className="col-sm-2">
                            <Button variant="outline-primary"  onClick={this.login}>Log In</Button>
                            </div>
                            <div className="col-sm-10">
                            <Button variant="outline-secondary" onClick={this.register}>Create Account</Button>
                            </div>
                        </div>    
                      <br></br>
                      <br></br>
                      <br></br>
                    </Card.Body> */}
    <div class="container">
        <div class="row">
            <div class="col-md-6">
            <div style={{paddingTop:"150px"}}>
                <p class="blue facebook"> <h2>Welcome</h2></p>
                <p class="black p_under_fb">With Our Application, share and stay in touch with those around you.</p> 
                </div>
            </div>

            <div class="col-md-6">
              <div style={{paddingTop:"150px"}}>
               <div class="panel">
                    <form>
                        <div class="form-group">
                                <input type="email" class="form-control"  id="email" placeholder="Enter email"></input>
                        </div>
                        <div class="form-group">
                            <input type="password" class="form-control" id="password" placeholder="Enter password"></input>
                        </div>
                            <button type="button" class="btn btn-primary btn-lg btn1"  onClick={this.login}><span class="bold">Login</span></button>
                            <p class="text-center mdpo blue">Don't have an account?</p>
                            <hr></hr>
                            <div class="div_btn2">
                            <button type="button" class="btn btn-success btn-lg btn2" onClick={this.register}><span class="bold">Register</span></button>
                             </div>
                    </form>
               </div>
               </div>
            </div>
             
        </div>
    </div>

            </div>
         
        );
    }
}

export default login2;