workspace {

  model {
    plinkoGame = softwareSystem "Plinko Game on Sui Blockchain" {
      description "A Plinko game implementation on the Sui blockchain, incorporating cryptographic techniques for fairness and transparency."
    }

    plinkoPlayer = person "Player" {
      description "User who plays the Plinko game, interacting through a web application."
    }

    suiBlockchain = softwareSystem "Sui Blockchain" {
      description "Sui blockchain where the Plinko game modules are deployed."
    }

    vercelHosting = softwareSystem "Vercel Hosting" {
      description "Cloud platform hosting the frontend and backend services of the Plinko game."
    }

    plinkoPlayer -> plinkoGame "Plays the Plinko game using"
    plinkoGame -> suiBlockchain "Makes Move calls"
    plinkoGame -> vercelHosting "Hosted on"
  }
  
  views {
    systemContext plinkoGame {
      include *
      autolayout lr
      title "Context View for the Plinko Game"
    }

    themes default
  }
}