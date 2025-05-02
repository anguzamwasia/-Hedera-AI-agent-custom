// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ClaimProcessor {
    enum Decision { PENDING, APPROVED, FLAGGED, DENIED }
    
    struct Claim {
        string claimId;
        uint256 timestamp;
        Decision decision;
        float riskScore;
    }
    
    mapping(string => Claim) public claims;
    
    event ClaimProcessed(string claimId, Decision decision);
    
    function processClaim(string memory claimId, float riskScore) public {
        Decision decision;
        
        if (riskScore < 0.3) {
            decision = Decision.APPROVED;
        } else if (riskScore < 0.7) {
            decision = Decision.FLAGGED;
        } else {
            decision = Decision.DENIED;
        }
        
        claims[claimId] = Claim({
            claimId: claimId,
            timestamp: block.timestamp,
            decision: decision,
            riskScore: riskScore
        });
        
        emit ClaimProcessed(claimId, decision);
    }
}