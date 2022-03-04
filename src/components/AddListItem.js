import { addWishListItem } from "../firebase";

export default function AddlistItem({ wishListId }) {
  const addItem = async (e) => {
    e.preventDefault();
    const itemDesc = document.getElementById("list_item").value;
    try {
      await addWishListItem(itemDesc, wishListId);
    } catch (error) {
      alert(error);
    }
  };

  return (
    <form name="addListItemForm">
      <h3>I want...</h3>
      <input
        type="text"
        name="item_desc"
        id="list_item"
        placeholder="item name.."
        autoComplete="off"
      />
      <button type="submit" onClick={addItem}>
        Add
      </button>
    </form>
  );
}
