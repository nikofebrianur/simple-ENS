import Head from "next/head";
import styles from "../styles/Home.module.css";
import Web3Modal from "web3modal";
import { ethers, providers } from "ethers";
import { useEffect, useRef, useState } from "react";

export default function Home() {
	const [walletConnected, setWalletConnected] = useState(false);
	const web3ModalRef = useRef();
	const [ens, setENS] = useState("");
	const [address, setAddress] = useState("");

	const setENSOrAddress = async (address, web3Provider) => {
		
	}

	const getProviderOrSigner = async () => {
		const provider = await web3ModalRef.current.connect();
		const web3Provider = new providers.Web3Provider(provider);

		const { chainId } = await web3Provider.getNetwork();
		if (chainId !== 5) {
			window.alert("Change the network to Goerli");
			throw new Error("Change network to Goerli");
		}
		const signer = web3Provider.getSigner();
		const address = await signer.getAddress();

		await setENSOrAddress(address, web3Provider);
		return signer;
	};

	const connectWallet = async () => {
		try {
			// Get the provider from web3Modal, which in our case is MetaMask
			// When used for the first time, it prompts the user to connect their wallet
			await getProviderOrSigner(true);
			setWalletConnected(true);
		} catch (err) {
			console.error(err);
		}
	};

	const renderButton = () => {
		if (walletConnected) {
			<div>Wallet connected</div>;
		} else {
			return (
				<button onClick={connectWallet} className={styles.button}>
					Connect your wallet
				</button>
			);
		}
	}

	useEffect(() => {
		if (!walletConnected) {
			web3ModalRef.current = new Web3Modal({
				network: "goerli",
				providerOptions: {},
				disableInjectedProvider: false,
			});
			connectWallet();
		}
	}, [walletConnected]);

	return (
		<div>
			<Head>
				<title>Nick's ENS Dapp</title>
				<meta name="description" content="Nick-ENS-Dapp" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<div className={styles.main}>
				<div>
					<h1 className={styles.title}>
						Welcome to My Web3site{ens ? ens : address}!
					</h1>
					<div className={styles.description}>
						It is my first simple ENS site for learn web3.
					</div>
					{renderButton()}
					<div>
						<img className={styles.image} src="./rabbit-chinese-2023.png" />
					</div>
				</div>
			</div>
			<footer className={styles.footer}>
				Made with &#10084; by Nick's
			</footer>
		</div>
	)
}
