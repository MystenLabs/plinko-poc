workspace {

  model {
    PlinkoGame = softwareSystem "Plinko Game on Sui Blockchain" {
      
      SmartContracts = container "Smart Contracts" {
        
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
        
        CounterNFT -> PlinkoGameContract "Provides unique VRF input to"
        HouseData -> PlinkoGameContract "Configures and manages treasury for"
      }
    }
  }
  
  views {
    component SmartContracts {
      include *
      autolayout lr
    }

    themes default
  }
}