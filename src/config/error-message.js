module.exports = {
  errorMessages() {
    return {
      "access_token_missing": "Missing Access Token. required header `Authorization`, please get `bearer_id` using .Auth().accessTokenLogin({ username: email@gmail.com , password: p@ssWord! }) method. for more information about .accessTokenLogin function visit https://bit.ly/3mbCX5F",
      "tag_name_missing": "Missing Tag Name. required tag Name",
      "id_missing": "ID is required",
    }
  }
};