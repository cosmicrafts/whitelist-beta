import React, { useEffect, useState, useContext } from 'react';
import { AppContext } from '../../context';
import { createActor } from "../../declarations/nfts_beta_test";

import { Header } from './header.js';

import "../css/login.css";
import "../css/terms.css";
import "../css/faction.css";
import "../css/thankyou.css";
import powered from "../../resources/powered.dark.svg";
import icon from "../../resources/design/logo.svg";
import plug from "../../resources/design/plug.svg";
import stoic from "../../resources/design/stoic.svg";
import earth from "../../resources/design/earth.svg";
import ic from "../../resources/design/dfinity.svg";

import leftbackground from "../../resources/design/leftship_background.svg";
import rightbackground from "../../resources/design/rightship_background.svg";
import join_discord from "../../resources/design/join_discord.svg";

//import { Actor, HttpAgent } from "@dfinity/agent";
import { AuthClient } from "@dfinity/auth-client";
import { StoicIdentity } from "ic-stoic-identity";

const Login = (props) => {
    const earthInstall = "https://www.earthwallet.io";
    const betaCanisterId = "k7h5q-jyaaa-aaaan-qaaaq-cai";
    const whitelist = [betaCanisterId];

    const [step, setStep] = useState("login");
    const [selectedFaction, setSelectedFaction] = useState("");
    /// Beta
    const [userIdentity, setUserIdentity] = useState(null);
    const [betaNFTsCanister, setBetaNFTsCanister] = useState(null);
    const [walletService, setWalletService] = useState("");

    useEffect(() => { if(userIdentity !== null && betaNFTsCanister !== null && walletService !== "") { console.log(userIdentity, betaNFTsCanister, walletService); saveLoggedData(); } }, [userIdentity, betaNFTsCanister, walletService]);

    const connectWallet = async (pWallet) => {
        switch(pWallet) {
          case 'stoic':
            setStoicID(await loginStoic());
            break;
          case 'plug':
            loginPlug();
            break;
          case 'InternetIdentity':
            loginII();
            break;
          case 'earth':
            loginEarth();
            break;
          default:
        }
    }

    const loginStoic = async () => {
        let sID = await StoicIdentity.load().then(async identity => {
          if (identity !== false) {
            //ID is a already connected wallet!
          } else {
            identity = await StoicIdentity.connect();
          }
          return identity;
        });
        return sID;
    };

    const setStoicID = async (identity) => {
      console.log("Stoic Identity", identity);
      setUserIdentity(identity);
      getBetaNFTsCanister(identity);
      setWalletService("Stoic");
    };

    const loginPlug = async () => {
      alert("Plug wallet comming soon!");
      return false;
        const isConnected = await window.ic.plug.requestConnect({
            whitelist,
        });
        const principalId = await window.ic.plug.agent.getPrincipal();
        var string = principalId.toString();
        saveLoggedData(string, "Plug");
    };

    const loginII = async () => {
        const authClient = await AuthClient.create();
        if (await authClient.isAuthenticated()) {
          handleAuthenticated(authClient);
        } else {
          let userII = await authClient.login({
            onSuccess: async () => {
              newAuthII();
            },
          });
        }
    };

    const loginEarth = async () => {
      alert("Earth wallet comming soon!");
      return false;
        if(window.earth !== undefined) {
            const address = await window.earth.connect();
            const _am = await window.earth.getAddressMeta();
            saveLoggedData(_am.principalId, "Earth");
        } else {
            window.open(earthInstall, "_blank");
        }
    };

    const saveLoggedData = async () => {
      console.log("Canister:", betaNFTsCanister);
      console.log("User Identity", userIdentity.getPrincipal());
      console.log(userIdentity.getPrincipal().toString());
      let _prev = await betaNFTsCanister.checkPlayerAdded();
      console.log("DATA FROM IC", _prev);
      if(_prev === true){
        setStep("done");
      } else {
        setStep("faction");
      }
    };

    const newAuthII = async () => {
        const authClient = await AuthClient.create();
        if (await authClient.isAuthenticated()) {
          handleAuthenticated(authClient);
        }
    };
    
    const handleAuthenticated = async (authClient) => {
        const identity = await authClient.getIdentity();
        setUserIdentity(identity);
        getBetaNFTsCanister(identity);
        setWalletService("InternetIdentity");
    };

    const getBetaNFTsCanister = async (identity) => {
      const _betaNFTsCanister = await createActor(betaCanisterId, {agentOptions: {
        host: 'https://mainnet.dfinity.network',
        identity,
      }});
      setBetaNFTsCanister(_betaNFTsCanister);
    };

    const selectFaction = async (faction) => {
      const _saved = await betaNFTsCanister.addBetaPlayer(walletService, faction);
      if(_saved === true){
        setStep("done");
      } else {
        setStep("done");
      }
    };

    const goToDiscord = () => {
      window.open("https://discord.gg/cosmicrafts");
    }

    const sectionDisplay = () => {
      switch(step){
        case "login":
          return(
            <>
              <div className='middle-div'>
                <div className='div-panel'>
                  <img src={icon} alt='Cosmicrafts icon' className='img-icon' />
                  <img src={ic} alt='Cosmicrafts icon' className='img-icon-ic' />
                  <div className='div-text-login'>
                    <label className='text-login'>REGISTER FOR THE<br/>CLOSED BETA RELEASE</label>
                  </div>
                  <div className='div-inner-panel'>
                    <div className='img-bkg' onClick={() => { connectWallet("InternetIdentity"); }}>
                      <img src={ic} alt='Plug wallet' className='img-ic' />
                      <label className='txt-wallet'>Internet Identity</label>
                    </div>
                    <div className='div-stoic'>
                      <div className='img-bkg' onClick={() => { connectWallet("stoic"); }}>
                        <img src={stoic} alt='Plug wallet' className='img-stoic' />
                        <label className='txt-wallet'>Stoic Wallet</label>
                      </div>
                    </div>
                  </div>
                  <div className='div-condition'>
                    <label className='txt-condition'>NOTE: ONLY REGISTERED WALLETS WILL BE<br/>ABLE TO TEST THE CLOSED BETA RELEASE</label>
                  </div>
                  <div className='div-terms'>
                    <label className='txt-terms'>BY REGISTRING TO THE BETA YOU ACCEPT THAT YOU HAVE READ AND AGREE WITH THE <span className='link-terms' onClick={() => { setStep("terms"); }}>TERMS AND CONDITIONS</span></label>
                  </div>
                  <div className='div-airdrop'>
                    <label className='txt-airdrop'>BETA</label>
                  </div>
                </div>
                <div className='div-left-background'>
                  <img src={leftbackground} className='img-left-background' />
                </div>
                <div className='div-right-background'>
                  <img src={rightbackground} className='img-right-background' />
                </div>
              </div>
              <div className='join-discord-div' onClick={() => { goToDiscord(); }}>
                <img src={join_discord} alt='Join our discord' className='join-discord-img' />
              </div>
            </>
          );
          case "terms":
            return(
              <>
                  <div className='terms-div-panel'>
                    <img src={icon} alt='Cosmicrafts icon' className='terms-img-icon' />
                    <img src={ic} alt='Cosmicrafts icon' className='terms-img-icon-ic' />
                    <div className='terms-div-text-login'>
                      <label className='text-login'>BETA TERMS AND CONDITIONS</label>
                    </div>
                    <div className='terms-long-text'>
                      <span className='terms-header'>1. Eligibility and Participation</span>
                      <br/>
                      <br/>We only allow invited players to participate in Beta and require that players be in good standing 
                      <br/>
                      <br/>You may participate in a Beta Program and play the Beta of Cosmicrafts only upon request and approval by World of Unreal LLC (“us” “WOU” “us” or “we’), and/ or by invitation from us. Only Players in good standing may participate in a Beta Program and Play the Beta of Cosmicrafts, subject to the World of Unreal LLC Terms of Service (the “Terms of Service”) and must remain so for the duration of these Terms. 
                      <br/>The Terms of Service continue to apply with regard to your condition of active/inactive, participation in a Beta Program, and playing Beta of Cosmicrafts. In the event that you are no longer in a good spot with World of Unreal LLC, your participation in the Beta Program and your ability to play the beta will be terminated.
                      <br/>
                      <br/><span className='terms-header'>2. Playing the Beta</span>
                      <br/>
                      <br/>The product lines, NFTS, and items may vary from the beta to the live version. We’re giving you a license to play the Beta and test all of its features 
                      <br/>
                      <br/>The Beta may be a separate, stand-alone service, accessible apart from the currently available Cosmicrafts (as defined in the Terms of Service) or maybe a feature or functionality for existing Cosmicrafts. A description of the Beta may be provided prior to or at the time you play the Beta, or if we make changes to the Beta. By agreeing to and complying with these Terms we grant you a non-exclusive, revocable, non-transferable, limited license to play the Beta of Cosmicrafts.
                      <br/>
                      <br/><span className='terms-header'>3. The Beta of Cosmicrafts Are As Is</span>
                      <br/>
                      <br/>Beta features by their very nature are meant for testing, which means that they may not work as expected, may have errors, or may cause unintended behavior.
                      <br/>You understand that we’re not responsible for any issues or problems caused by the Beta. We have no obligation to provide any kind of support for the Beta.
                      <br/>
                      <br/>By accepting these Terms or using the Beta, you understand and acknowledge that the Beta is being provided as a “Beta” version and made available on an “As Is” or “As Available” basis. The Beta may contain bugs, errors, and other problems. YOU ASSUME ALL RISKS AND ALL COSTS ASSOCIATED WITH YOUR USE OF THE BETA, INCLUDING, WITHOUT LIMITATION, ANY INTERNET ACCESS FEES, BACKUP EXPENSES, COSTS INCURRED FOR THE USE OF YOUR DEVICE AND PERIPHERALS, AND ANY DAMAGE TO ANY EQUIPMENT, OR SOFTWARE, INFORMATION OR DATA. In addition, we are not obligated to provide any maintenance, technical, or other support for the Beta.
                      <br/>
                      <br/><span className='terms-header'>4. Feedback</span>
                      <br/>
                      <br/>We need your feedback to understand how to improve the Beta. By participating in our Beta Programs, you agree to provide us feedback, and any feedback you provide belongs to World of Unreal LLC. 
                      <br/>
                      <br/>If we publish your feedback about the Beta, we’ll be sure to either not identify you, or will contact you to get your permission to use your name.
                      <br/>
                      <br/>The Beta is made available to you for the purposes of evaluation and feedback without any compensation or reimbursement of any kind from World of Unreal LLC. You acknowledge the importance of communication between you and World of Unreal LLC during your use of the Beta and agree to receive related correspondence and updates from us.  In the event you request to opt-out from such communications, your participation in the Beta Program will be terminated, and your use of the applicable Beta will likewise be discontinued.
                      <br/>
                      <br/>We may also monitor how you play the Beta and use that information to improve the Beta or our other products and services.
                      <br/>
                      <br/><span className='terms-header'>5. Intellectual Property</span>
                      <br/>
                      <br/>World of Unreal LLC owns all of the intellectual property involved with the Beta of Cosmicrafts 
                      <br/>
                      <br/>This Agreement doesn’t give you a license to use our trademarks or brand features (you may have another agreement with World of Unreal LLC that gives you this type of permission). 
                      <br/>
                      <br/>You are not permitted to reverse engineer or attempt to decipher any code except in situations as permitted by us.
                      <br/>
                      <br/>You agree that we own all legal rights, title, and interest in and to the Beta Program and the Beta of Cosmicrafts, including all intellectual property rights, and except for the license provided herein, no other rights or permissions to any of the World of Unreal LLC Services or products are granted.
                      <br/>
                      <br/>Nothing herein gives you a right to use any of our trade names, trademarks, service marks, logos, domain names, and other distinctive brand features.  Except to the extent permitted by law, you may not modify, distribute, prepare derivative works of, reverse engineer, reverse assemble, disassemble, decompile or otherwise attempt to decipher any code in connection with the Beta of Cosmicrafts and/or any other aspect of World of Unreal LLC technology, except as permitted by us.
                      <br/>
                      <br/><span className='terms-header'>6. Term and Termination</span>
                      <br/>
                      <br/>You can end this agreement by simply stopping playing the Beta and notifying World of Unreal LLC of your intention to no longer participate in the applicable Beta Program.
                      <br/>
                      <br/>These terms will remain in effect for as long as you play the Beta. Either party may terminate these Terms before the end of your participation in the applicable Beta Program for any reason or no reason upon written notice to the other party.  Upon termination, you will cease using the Beta.
                      <br/>
                      <br/>These Terms will automatically terminate upon any breach by you of any of your obligations hereunder including breach of confidentiality obligations. Your breach of any of your obligations under the Agreement may result in your immediate termination from the use of other Betas, or participation in any other Beta Programs.
                      <br/>
                      <br/>Modification and Termination
                      <br/>
                      <br/>We can terminate or disable your ability to play the Beta at any time. Likewise, you can decide to stop using the Beta at any time. We may remove your access to features of the Beta at any time.
                      <br/>
                      <br/>You understand that we’re not responsible for any issues or problems caused by the Beta. We have no obligation to provide any kind of support for the Beta.
                      <br/>
                      <br/>We reserve the right to modify or terminate the Beta Program or the Beta, or your use of the Beta, to limit or deny access to the Beta and/or participation in the Beta Program, at any time, in our sole discretion, for any reason, with or without notice and without liability to you. You may discontinue your use of the Beta and/or your participation in the Beta Program at any time.
                      <br/>
                      <br/><span className='terms-header'>7. Disclaimer of Warranties</span>
                      <br/>
                      <br/>We disclaim all warranties regarding the Beta Program and Playing the Beta. You acknowledge that using the Beta is at your own risk.
                      <br/>
                      <br/>YOU HEREBY ACKNOWLEDGE AND AGREE THAT THE BETA IS PROVIDED BY WORLD OF UNREAL LLC ON AN “AS IS” BASIS AND AS AVAILABLE, AND YOUR ACCESS TO, PARTICIPATION, AND/OR USE OF THE WORLD OF UNREAL LLC BETA PROGRAM OR BETA SERVICES, IS AT YOUR SOLE RISK. TO THE EXTENT PERMITTED BY APPLICABLE LAW, WORLD OF UNREAL LLC EXPRESSLY DISCLAIMS ALL AND YOU RECEIVE NO WARRANTIES AND CONDITIONS OF ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, THOSE OF MERCHANTABILITY, SATISFACTORY QUALITY, TITLE, FITNESS FOR A PARTICULAR PURPOSE AND NON-INFRINGEMENT. WORLD OF UNREAL LLC MAKES NO WARRANTY THAT ANY OF THE SERVICES WILL MEET YOUR REQUIREMENTS AND/OR THAT THE SERVICES WILL BE UNINTERRUPTED, TIMELY, OR ERROR-FREE, NOR DOES WORLD OF UNREAL LLC MAKE ANY WARRANTY AS TO THE RESULTS THAT MAY BE OBTAINED FROM THE USE OF THE SERVICES OR THE ACCURACY OF ANY OTHER INFORMATION OBTAINED THROUGH THE SERVICES. YOU UNDERSTAND AND AGREE THAT ANY MATERIAL AND/OR DATA DOWNLOADED OR OTHERWISE OBTAINED THROUGH THE USE OF ANY OF THE SERVICES IS DONE AT YOUR SOLE RISK AND THAT YOU WILL BE SOLELY RESPONSIBLE FOR ANY DAMAGE TO YOUR COMPUTER SYSTEM AND/OR LOSS OF DATA THAT RESULTS FROM THE DOWNLOAD OF SUCH MATERIAL AND/OR DATA. NO INFORMATION OR ADVICE, WHETHER ORAL OR WRITTEN, OBTAINED BY YOU FROM WORLD OF UNREAL OR THROUGH THE BETA SHALL CREATE ANY WARRANTY NOT EXPRESSLY MADE HEREIN. SOME JURISDICTIONS DO NOT ALLOW THE EXCLUSION OF CERTAIN WARRANTIES AND CONDITIONS, SO SOME OF THE ABOVE EXCLUSIONS MAY NOT APPLY TO YOU.
                      <br/>
                      <br/><span className='terms-header'>8. Limitation of Liability and Indemnification</span>
                      <br/>
                      <br/>World of Unreal LLC  and its affiliates shall not be liable to you for any damages 
                      <br/>
                      <br/>IN NO EVENT SHALL WORLD OF UNREAL LLC OR ITS  AFFILIATES BE LIABLE FOR ANY INDIRECT, SPECIAL, CONSEQUENTIAL AND/OR INCIDENTAL LOSS, EXEMPLARY OR OTHER DAMAGES RELATED TO THESE TERMS AND/OR WHETHER DIRECT OR INDIRECT: (i) LOSS OF DATA, (ii) LOSS OF INCOME, (iii) LOSS OF OPPORTUNITY, (iv) LOST PROFITS, AND (v) COSTS OF RECOVERY OR ANY OTHER DAMAGES, HOWEVER CAUSED AND BASED ON ANY THEORY OF LIABILITY, AND WHETHER OR NOT FOR BREACH OF CONTRACT, TORT (INCLUDING NEGLIGENCE), VIOLATION OF STATUTE, OR OTHERWISE, AND WHETHER OR NOT WORLD OF UNREAL LLC HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. TO THE EXTENT PERMITTED BY APPLICABLE LAW.
                      <br/>
                      <br/>Indemnification
                      <br/>
                      <br/>You will indemnify us for your breach of these Terms, your playing of the Beta, and your violations of laws. World of Unreal LLC is not agreeing to indemnify you as part of your playing of the Beta or participation in a Beta Program.
                      <br/>
                      <br/>You agree to hold harmless and indemnify World of Unreal LLC, our affiliates and subsidiaries, officers, directors, agents, and employees from and against any third party claim arising from or in any way related to (i) your breach of the Terms, (ii) your play of the Beta and/or your participation in the Beta Program(s), or (iii) your violation of applicable laws, rules or regulations in connection with the Services.
                      <br/>
                      <br/><span className='terms-header'>9. Confidential Information</span>
                      <br/>
                      <br/>You acknowledge and agree that: (i) the Beta Program and Beta constitute Confidential Information as defined in the Terms of Service (ii) you acknowledge that the successful market launch of commercial versions of the Beta requires you to keep all World of unreal LLC data and information discussed and/or made available through or contained in Beta Program, including, without limitation, the Beta strictly confidential; (iii) the premature release of any of the Confidential Information would damage World of Unreal LLC competitive and intellectual property interests; and (iv) and information about the Beta shall not be shared with anyone other than other authorized users of the Beta.
                      <br/>
                      <br/><span className='terms-header'>10. General</span>
                      <br/>
                      <br/>We may change these terms from time to time and World of unreal LLC may not notify you. If you use to play the  Beta, we’ll assume you have agreed to those changes.
                      <br/>
                      <br/><span className='terms-header'>Changes to Terms</span>
                      <br/>
                      <br/>We reserve the right to make changes to these Terms from time to time and may or may not notify you in such an event. You understand and agree that if you play the Beta after the date on which the Terms have changed, we will treat your use as acceptance of the updated Terms.
                      <br/>
                      <br/><span className='terms-header'>Compliance with Laws</span>
                      <br/>
                      <br/>It is expected that both you and World of Unreal LLC will comply with laws and regulations that apply to the Beta.
                      <br/>
                      <br/>Both parties agree to comply with all applicable local, state, national, and foreign laws, rules, and regulations, including, but not limited to, all applicable import and export laws and regulations governing the use, transmission, and/or communication of content, in connection with their performance, participation, access and/or play of the Beta or Beta Program.
                      <br/>
                      <br/><span className='terms-header'>Survival</span>
                      <br/>
                      <br/>Some of these Terms and obligations will remain even if this agreement is terminated or expires.
                    </div>
                    <div className='terms-btn-accept' onClick={() => { setStep("login"); }}>
                      <label className='terms-btn-txt'>Accept and continue</label>
                    </div>
                    <div className='terms-div-airdrop'>
                      <label className='txt-airdrop'>BETA</label>
                    </div>
                  </div>
              </>
            );
        case "faction":
          return(
            <>
              <div className='faction-cosmic-logo'></div>
              <div className='faction-welcome-title'><label className='faction-welcome-title-txt'>WELCOME TO COSMICRAFTS CLOSED BETA</label></div>
              <div className='faction-panel-left' onClick={() => { selectFaction(1); } }>
                <div className='faction-badge-left'></div>
              </div>
              <div className='faction-text-cosmicons-div'><label className='faction-description'>The last remains of the Confederacy that have<br />ruled the since spiral beings reached the stars.</label></div>
              <div className='faction-panel-right' onClick={() => { selectFaction(2); } }>
                <div className='faction-badge-right'></div>
              </div>
              <div className='faction-text-spirats-div'><label className='faction-description'>The space pirats are mercenaries, exiles and<br />outlaws, rebels against any form of empire or laws.</label></div>
              <div className='faction-subtitle-div'><label className='faction-subtitle'>CHOOSE ONE FACTION TO PLAY</label></div>
              <div className='faction-dfinity-logo'></div>
            </>
          );
        case "done":
          return(
            <>
              <div>
                <label className='txt-thankyou'>Thanks for registering to<br/>the Cosmicrafts Beta!</label>
                <div className='img-thankyou'></div>
                <label className='txt-release'>The release is set for August 2022</label>
                <label className='txt-stay'>Stay tunned to our social networks to know the exact day and time of the closed beta release</label>
                <a href="https://h5aet-waaaa-aaaab-qaamq-cai.raw.ic0.app/u/Cosmicrafts" target="_blank"><div className='social-link dscvr'></div></a>
                <a href="https://az5sd-cqaaa-aaaae-aaarq-cai.ic0.app/u/Cosmicrafts" target="_blank"><div className='social-link distrik'></div></a>
                <a href="https://twitter.com/cosmicrafts" target="_blank"><div className='social-link twitter'></div></a>
                <a href="https://discord.gg/cosmicrafts" target="_blank"><div className='social-link discord'></div></a>
                <a href="https://www.instagram.com/cosmicraftsgame/" target="_blank"><div className='social-link instagram'></div></a>
                <a href="https://www.facebook.com/Cosmicrafts" target="_blank"><div className='social-link facebook'></div></a>
                <a href="https://www.youtube.com/channel/UCyq-iQbwTSb1TnGj3pyTv-Q/featured" target="_blank"><div className='social-link youtube'></div></a>
              </div>
            </>
          );
      };
    };


    return (
      <div className='main-div'>
        { 
          step !== "faction" ? 
            <Header />
          :
            <></>
        }
        { sectionDisplay() }
      </div>
    )
};

export { Login };