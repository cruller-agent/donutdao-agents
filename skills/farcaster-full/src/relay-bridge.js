const { Wallet, JsonRpcProvider, parseEther, formatEther } = require('ethers');

async function bridgeViaRelay(privateKey, amount, fromChainId, toChainId) {
  const fromRpc = fromChainId === 8453 ? 'https://mainnet.base.org' : 'https://eth.llamarpc.com';
  const provider = new JsonRpcProvider(fromRpc);
  const wallet = new Wallet(privateKey, provider);
  
  console.log('Getting quote from Relay.link...');
  console.log('From:', wallet.address);
  console.log('Amount:', formatEther(amount), 'ETH');
  console.log('From chain:', fromChainId, '-> To chain:', toChainId);
  
  // Get quote
  const quoteRes = await fetch('https://api.relay.link/quote', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user: wallet.address,
      originChainId: fromChainId,
      destinationChainId: toChainId,
      originCurrency: '0x0000000000000000000000000000000000000000',
      destinationCurrency: '0x0000000000000000000000000000000000000000',
      amount: amount.toString(),
      tradeType: 'EXACT_INPUT'
    })
  });
  
  const quote = await quoteRes.json();
  
  if (quote.message || !quote.steps) {
    throw new Error('Quote failed: ' + JSON.stringify(quote));
  }
  
  const txData = quote.steps[0].items[0].data;
  console.log('\nQuote received:');
  console.log('- Input:', formatEther(quote.details.currencyIn.amount), 'ETH');
  console.log('- Output:', formatEther(quote.details.currencyOut.amount), 'ETH on destination');
  console.log('- Fees:', quote.fees.relayer.amountFormatted, 'ETH');
  
  // Execute transaction
  console.log('\nSending bridge transaction...');
  const tx = await wallet.sendTransaction({
    to: txData.to,
    data: txData.data,
    value: BigInt(txData.value),
    maxFeePerGas: BigInt(txData.maxFeePerGas) * 2n,
    maxPriorityFeePerGas: BigInt(txData.maxPriorityFeePerGas) * 2n,
    gasLimit: 100000n
  });
  
  console.log('TX Hash:', tx.hash);
  console.log('Waiting for confirmation...');
  
  const receipt = await tx.wait();
  console.log('Bridge transaction confirmed!');
  console.log('Block:', receipt.blockNumber);
  
  // Poll for completion
  const requestId = quote.steps[0].requestId;
  console.log('\nWaiting for bridge to complete (requestId:', requestId, ')...');
  
  for (let i = 0; i < 60; i++) {
    await new Promise(r => setTimeout(r, 5000));
    
    const statusRes = await fetch(`https://api.relay.link/intents/status?requestId=${requestId}`);
    const status = await statusRes.json();
    
    if (status.status === 'success') {
      console.log('Bridge complete!');
      return { success: true, txHash: tx.hash, requestId };
    } else if (status.status === 'failed') {
      throw new Error('Bridge failed: ' + JSON.stringify(status));
    }
    
    console.log('Status:', status.status || 'pending', '(' + (i+1)*5 + 's)');
  }
  
  console.log('Bridge still pending after 5 minutes - check manually');
  return { success: 'pending', txHash: tx.hash, requestId };
}

// CLI
if (require.main === module) {
  const privateKey = process.env.PRIVATE_KEY;
  const amount = process.argv[2] || '0.0006';
  const fromChain = parseInt(process.argv[3] || '8453'); // Base
  const toChain = parseInt(process.argv[4] || '10'); // Optimism
  
  if (!privateKey) {
    console.log('Usage: PRIVATE_KEY=0x... node relay-bridge.js [amount] [fromChainId] [toChainId]');
    console.log('Default: Bridge 0.0006 ETH from Base (8453) to Optimism (10)');
    process.exit(1);
  }
  
  bridgeViaRelay(privateKey, parseEther(amount), fromChain, toChain)
    .then(result => {
      console.log('\n=== Bridge Result ===');
      console.log(JSON.stringify(result, null, 2));
    })
    .catch(err => {
      console.error('Error:', err.message);
      process.exit(1);
    });
}

module.exports = { bridgeViaRelay };
