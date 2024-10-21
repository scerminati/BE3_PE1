class UserDTO {
  constructor(user) {
    this._id = user._id;
    this.email = user.email;
    this.first_name = user.first_name;
    this.last_name = user.last_name;
    this.role = user.role;
    this.age = user.age;
    this.cart = user.cart;
  }
}
export default UserDTO;
