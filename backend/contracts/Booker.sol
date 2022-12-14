// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4;
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "redstone-evm-connector/lib/contracts/message-based/PriceAware.sol";

contract Booker is Ownable, ERC721, ERC721URIStorage, PriceAware{

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    uint256 public fee;
    address ownerAddress;
    mapping(string => Stay) stays;

    struct Stay {
        string id;
        uint256 costPerPerson;
        uint256 fundsRaised;
        uint8 spots;
        string imageURL;
    }

    event BookStay(address user, string stayId, uint256 value);
    event JoinStay(address user, uint256 value);

    constructor() ERC721("StayToken", "STV") {
        fee = 104;
        ownerAddress = msg.sender;
    }
    
    function addStay(string calldata id, uint256 costPerPerson, uint8 spots, string calldata imageURL) public {
        Stay memory newStay = Stay({
            id: id,
            costPerPerson: costPerPerson,
            fundsRaised: 0,
            spots: spots,
            imageURL: imageURL
        });
        stays[newStay.id] = newStay;
    }

    function joinWithETH(string calldata stayId) public payable {
        Stay storage stayToJoin = stays[stayId];
        uint256 ethPrice = getPriceFromMsg(bytes32("ETH"));
        require(msg.value >= stayToJoin.costPerPerson/ethPrice*10**18, "wrong amount of tokens");
        require(stayToJoin.spots > 0, "no spots left");
        payable(address(this)).transfer(msg.value);
        if(stayToJoin.spots == 0){
            payable(ownerAddress).transfer(stayToJoin.fundsRaised);
            emit BookStay(msg.sender, stayId, stayToJoin.fundsRaised);
            delete stays[stayId];
        }else{
            emit JoinStay(msg.sender, msg.value);
        }
    }

    function joinWithERC20(IERC20 token, uint256 amount, string calldata stayId) public {
        Stay storage stayToJoin = stays[stayId];
        require(amount <= token.balanceOf(msg.sender), "balance too low");
        require(amount == stayToJoin.costPerPerson*fee/100, "wrong amount of tokens");
        require(stayToJoin.spots > 0, "no spots left");
        token.transferFrom(msg.sender, address(this), amount);
        _tokenIds.increment();
        _mint(msg.sender, _tokenIds.current());
        _setTokenURI(_tokenIds.current(), stayToJoin.imageURL);
        stayToJoin.spots--;
        stayToJoin.fundsRaised += amount;
        if(stayToJoin.spots == 0){
            token.transferFrom(address(this), ownerAddress, stayToJoin.fundsRaised);
            emit BookStay(msg.sender, stayId, stayToJoin.fundsRaised);
            delete stays[stayId];
        }else{
            emit JoinStay(msg.sender, amount);
        }
    }
    function getStay(string calldata id) external view returns(Stay memory){
        return stays[id];
    }
    function setFee(uint256 feePercentage) public onlyOwner {
        fee = feePercentage;
    }
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }
    function isSignerAuthorized(address _receviedSigner) public override virtual view returns (bool) {
    return _receviedSigner == 0xFE71e9691B9524BC932C23d0EeD5c9CE41161884; // redstone main demo provider
  }
}