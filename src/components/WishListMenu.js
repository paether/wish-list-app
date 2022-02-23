import AddlistItem from "./AddListItem";
import ListItems from "./ListItems";

export default function WishListMenu({ wishList, wishListId }) {
  return (
    <div className="wish-list-menu-container">
      <h1>You are editing this list: {wishList.listName}</h1>
      <AddlistItem wishListId={wishListId} />
      <ListItems wishListId={wishListId} />
    </div>
  );
}
