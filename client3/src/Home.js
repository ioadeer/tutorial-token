import React, {
  useState,
  useEffect,
} from 'react';
import Web3 from 'web3';

import {
  useDispatch,
} from 'react-redux';

import TutorialToken from './contracts/TutorialToken.json';

import {
  setUserAddress,
  setIsAdmin,
  setMinterKey,
  setBurnerKey,
  setIsMinter,
  setIsBurner,
} from './actions/UserActions';

import NavBar from './components/NavBar';
import AdminRole from './components/AdminRole';

function Home() {
  const dispatch = useDispatch();
  const [ethBrowserError, setEthBrowserError] = useState(null);
  const [ethContractError, setEthContractError] = useState(null);
  const [account, setAccount] = useState(null);
  const [tutorialToken, setTutorialToken] = useState(null);
  const [contractAddress, setContractAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adminRole, setAdminRole] = useState(false);
  const [burnerRole, setBurnerRole] = useState(false);
  const [burnerRoleKey, setBurnerRoleKey] = useState('');
  const [minterRole, setMinterRole] = useState(false);
  const [minterRoleKey, setMinterRoleKey] = useState('');
  const [init, setInit] = useState(false);

  async function loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      setEthBrowserError('Non-Ethereum browser detected');
    }
  }

  async function loadBlockChainData() {
    const { web3 } = window;
    const accounts = await web3.eth.getAccounts();
    setAccount(accounts[0]);
    dispatch(setUserAddress(accounts[0]));
    const netWorkId = await web3.eth.net.getId();
    const netWorkData = TutorialToken.networks[netWorkId];
    if (netWorkData) {
      const tutorialTokenInstance = new web3.eth.Contract(TutorialToken.abi, netWorkData.address);
      setTutorialToken(tutorialTokenInstance);
      const { _address } = tutorialTokenInstance;
      const tempAdminRole = await tutorialTokenInstance.methods.DEFAULT_ADMIN_ROLE().call();
      const hasAdminRole = await tutorialTokenInstance.methods.hasRole(tempAdminRole, accounts[0]).call();
      dispatch(setIsAdmin(hasAdminRole));
      setAdminRole(hasAdminRole);
      const tempMinterRole = await tutorialTokenInstance.methods.MINTER_ROLE().call();
      setMinterRoleKey(tempMinterRole);
      dispatch(setMinterKey(tempMinterRole));
      const hasMinterRole = await tutorialTokenInstance.methods.hasRole(tempMinterRole, accounts[0]).call();
      setMinterRole(hasMinterRole);
      dispatch(setIsMinter(hasMinterRole));
      const tempBurnerRole = await tutorialTokenInstance.methods.BURNER_ROLE().call();
      setBurnerRoleKey(tempBurnerRole);
      dispatch(setBurnerKey(tempBurnerRole));
      const hasBurnerRole = await tutorialTokenInstance.methods.hasRole(tempBurnerRole, accounts[0]).call();
      setBurnerRole(hasBurnerRole);
      dispatch(setIsBurner(hasBurnerRole));
      setContractAddress(_address);
      setLoading(false);
    } else {
      setEthContractError('TutorialToken not deployed to detected network');
    }
  }
  useEffect(() => {
    if (!init) {
      loadWeb3();
      loadBlockChainData();
      setInit(true);
    }
    return () => {
      console.log('Desmontando blockchain ...');
    };
  }, [init]);

  return (
    <div className="App">
      {ethBrowserError && (
        <>
          <p>{ ethBrowserError }</p>
        </>
      )}
      {ethContractError && (
        <>
          <p>{ ethContractError }</p>
        </>
      )}
      {loading && (
        <>
          <p>loading ...</p>
        </>
      )}
      {!loading && (
        <>
          <NavBar
            contractAddress={contractAddress}
          />
        </>
      )}
      {adminRole && (
        <AdminRole
          tutorialToken={tutorialToken}
          minterRoleKey={minterRoleKey}
          burnerRoleKey={burnerRoleKey}
          adminAddress={account}
        />
      )}
    </div>
  );
}

export default Home;
