This is the repository from Starknet House session 9: 'End to end contract and app deployment' presented by [Triality](https://twitter.com/trialityorg).

Learn more about Triality, the decentralized knowledge-sharing platform for web3 developers, at [https://triality.org](https://triality.org)

YouTube recording to be posted soon!

The empty skeleton for the UI can be found on branch [ui_skeleton](https://github.com/trialityorg/starknet-house-session/tree/ui_skeleton)

## Getting Started

Run the web server:

```
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Compiling/Deployting the Contract

Run the following to start your cairo environment `python3 -m venv ~/cairo_venv source ~/cairo_venv/bin/activate`

Run the following from inside the contracts directory to compile `starknet-compile demo.cairo \ --output demo_compiled.json \ --abi demo_abi.json \ `

Before you deploy make sure you set the test network `export STARKNET_NETWORK=alpha-goerli`

To Deploy the contract run the following from inside the contracts director `starknet deploy --contract demo_compiled.json --no_wallet --inputs 0x06Cd3d538d5BF4b06D4bd8991CB88930Ec358250E914fF48A8A305dAe72FCEaa`
Once deployed successfully, you can grab the contract address from the command line and view your contract on Voyager https://voyager.online/. It may take several minutes for your contract to be confirmed on L2.

## Testing the Contract

From inside your root directory run `npm run contract-tests`
You should see the results in your command line after a short period to wait for testing

### Acknowledgements

- [Starknet.JS](https://www.starknetjs.com/)
- [starknet-react](https://github.com/apibara/starknet-react)
- This project was created from the [Next.js template](https://github.com/apibara/starknet-react#getting-started-with-nextjs) in starknet-react
