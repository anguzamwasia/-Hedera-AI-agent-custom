export const checkHederaBalance = async () => {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/test-hedera`);
    return response.json();
  };
  
  export const submitClaim = async (claimData) => {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/claims`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(claimData)
    });
    return response.json();
  };