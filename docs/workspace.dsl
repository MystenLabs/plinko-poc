workspace {

    model {
        properties {
            "structurizr.groupSeparator" "/"
        }

        plinkoPlayer = person "Player" "User who plays the Plinko game, interacting through a web application." "Main Actor"

        plinkoGame = softwaresystem "Plinko Game on Sui Blockchain" "A Plinko game implementation on the Sui blockchain, incorporating cryptographic techniques for fairness and transparency." "Main System" {

            smartContracts = container "Smart Contracts" "Handles game logic, round management, and interactions with the Sui blockchain for the Plinko game." "Blockchain/Sui" "Blockchain" {
                counterNFT = component "Counter NFT" "Manages unique input for each game round." "Sui Move Module" "Move Module"
                houseData = component "House Data" "Stores game configuration and manages treasury." "Sui Move Module" "Move Module"
                plinkoGameContract = component "Plinko Game Contract" "Orchestrates gameplay, handling game rounds and payouts." "Sui Move Module" "Move Module"

                counterNFT -> plinkoGameContract "Provides unique VRF input to"
                houseData -> plinkoGameContract "Provides configuration and treasury management for"
            }

            // Correctly defined container
            plinkoWebApplication = container "Web Application" "Web application for users to interact with the Plinko Game." {
                technology "ReactJS/NextJS"
                tags "User Interface"
            }

        }

        suiBlockchain = softwaresystem "Sui Blockchain" "Sui blockchain where the Plinko game modules are deployed and interacted with." "Secondary System"

        plinkoPlayer -> plinkoGame "Plays the Plinko game using"
        plinkoGame -> suiBlockchain "Interacts with Sui Blockchain for game logic and transactions"

        deploymentEnvironment "Production" {
            deploymentNode "Sui Blockchain" "https://sui.io/" "Blockchain / Smart Contracts"  {
                deploymentNode "Mainnet" {
                    smartContractsInstance = containerInstance smartContracts
                }
            }

            deploymentNode "Vercel" "https://vercel.com" "3rd Party Cloud Paas" {
                deploymentNode "Client App" "Web application for Plinko Game" "Web Server" {
                    plinkoWebAppInstance = containerInstance plinkoWebApplication "ReactJS/NextJS App"
                }
            }
        }
    }

    views {
        systemcontext plinkoGame "SystemContext" {
            include *
            autoLayout
            description "The system context diagram for the Plinko Game on the Sui Blockchain."
        }

        container plinkoGame "Containers" {
            include *
            autoLayout
            description "The container diagram for the Plinko Game on Sui Blockchain."
        }

        component smartContracts "SmartContractComponents" {
            include *
            autoLayout
            description "The component diagram for the Smart Contracts within the Plinko Game."
        }

        deployment plinkoGame "Production" "DeploymentDiagram" {
            include *
            autoLayout
            description "The deployment diagram for the Plinko Game on the Sui Blockchain."
        }

        styles {
            element "Main Actor" {
                shape person
                background #08427b
                color #ffffff
            }

            element "Secondary System" {
                background #1168bd
                color #ffffff
                shape RoundedBox
            }

            element "Main System" {
                background #08427b
                color #ffffff
                shape RoundedBox
            }

            element "Blockchain" {
                background #f4f4f4
                color #000000
                icon "https://s2.tokeninsight.com/static/coins/img/content/imgUrl/sui_logo.png"
                shape Pipe
            }

            element "Move Module" {
                shape Hexagon
            }
        }
    }
}
