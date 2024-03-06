// This section describes the overall system context for the Plinko Game
workspace {

  model {
    plinkoGame = softwareSystem "Plinko Game on Sui Blockchain" {
      description "A Plinko game implementation on the Sui blockchain, incorporating cryptographic techniques for fairness and transparency."
    }

    plinkoPlayer = person "Player" {
      description "User who plays the Plinko game, interacting through a web application."
    }

    suiBlockchain = softwareSystem "Sui Blockchain" {
      description "Sui blockchain where the Plinko game modules are deployed and interacted with."
    }

    plinkoPlayer -> plinkoGame "Plays the Plinko game using"
    plinkoGame -> suiBlockchain "Interacts with Sui Blockchain for game logic and transactions"
  }
  
  views {
    systemContext plinkoGame {
      include *
      autolayout lr
      title "System Context Diagram for the Plinko Game"
    }

    themes default
  }
}

// This section defines the container and component views for the Plinko Game
workspace {

  model {
    PlinkoGame = softwareSystem "Plinko Game on Sui Blockchain" {
      
      // Containers within the Plinko Game system
      SmartContracts = container "Smart Contracts" {
        
        // Components representing smart contracts on the Sui blockchain
        CounterNFT = component "Counter NFT" {
          description "Manages unique input for each game round."
          technology "Sui Move"
        }
        
        HouseData = component "House Data" {
          description "Stores game configuration and manages treasury."
          technology "Sui Move"
        }
        
        PlinkoGameContract = component "Plinko Game Contract" {
          description "Orchestrates gameplay, handling game rounds and payouts."
          technology "Sui Move"
        }
        
        // Interactions between components
        CounterNFT -> PlinkoGameContract "Provides unique VRF input to"
        HouseData -> PlinkoGameContract "Provides configuration and treasury management for"
      }
    }
  }
  
  views {
    // View for the components within the Smart Contracts container
    component SmartContracts {
      include *
      autolayout lr
      title "Component View for Smart Contracts in Plinko Game"
    }

    themes default
  }
}
