module.exports = {
  errorMessages() {
    return {
      env_missing:
        'username and password are needed to run testsuite: set environment variable: MANTIUM_USER_NAME and MANTIUM_PASSWORD',
      access_token_missing:
        'Missing Access Token. required header `Authorization`, please get `bearer_id` using .Auth().accessTokenLogin({ username: email@gmail.com , password: p@ssWord! }) method. for more information about .accessTokenLogin function visit https://bit.ly/3mbCX5F',
      tag_name_missing: 'Missing Tag Name. required tag Name.',
      policy_name_missing: 'Missing Policy Name. required policy Name.',
      input_missing: 'Missing Input. required Input.',
      id_missing: 'ID is required.',
      Provider_missing: 'Please give `Provider` name in main calling function.',
      prompts: {
        basic_settings: {
          temperature: 'Temperature must be less than or equal to 1',
          temperature_number: 'Temperature must be number',
        },
      },
    };
  },
};
