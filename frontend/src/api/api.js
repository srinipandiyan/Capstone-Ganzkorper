import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3001";

/** API Class.
 *
 * Static class tying together methods used to get/send to to the API.
 * There shouldn't be any frontend-specific stuff here, and there shouldn't
 * be any API-aware stuff elsewhere in the frontend.
 *
 */

class GanzkorperApi {
  // the token for interactive with the API will be stored here.
  static token;

  static async request(endpoint, data = {}, method = "get") {
    console.debug("API Call:", endpoint, data, method);

    //there are multiple ways to pass an authorization token, this is how you pass it in the header.
    //this has been provided to show you another way to pass the token. you are only expected to read this code for this project.
    const url = `${BASE_URL}/${endpoint}`;
    const headers = { Authorization: `Bearer ${GanzkorperApi.token}` };
    const params = (method === "get")
        ? data
        : {};

    try {
      return (await axios({ url, method, data, params, headers })).data;
    } catch (err) {
      console.error("API Error:", err.response);
      let message = err.response.data.error.message;
      throw Array.isArray(message) ? message : [message];
    }
  }

  // Individual API routes

   /** Get token for login from username, password. */
   static async login(data) {
    let res = await this.request("auth/token", data, "post");
    return res.token; 
  }

  /** Signup for site. */
  static async signup(data) {
    let res = await this.request("auth/register", data, "post");
    return res.token;
  }

  /** Get user profile page. */
  static async saveProfile(username, data) {
    let res = await this.request(`users/${username}`, data, "patch");
    return res.user;
  }

  /** Delete a user. */
  static async removeUser(username) {
    let res = await this.request(`users/${username}`, "delete");
    return res;
  }

  /** Get workouts by user. */
  static async getWorkouts(userRef) {
    let res = await this.request(`workouts/${userRef}`, "get");
    return res.workouts;
  }

  /** Create a workout by user. */
  static async addWorkout(userRef, data) {
    let res = await this.request(`workouts/${userRef}`, data, "post");
    return res.workout;
  }

   /** Update a workout. */
   static async updateWorkout(workoutName, data) {
    let res = await this.request(`workouts/${workoutName}`, data, "patch");
    return res.workout;
  }

  /** Delete a workout. */
  static async removeWorkout(id) {
    let res = await this.request(`workouts/${id}`, "delete");
    return res;
  }

  /** Get histories by workout. 
   * data = {userRef, exerciseId}
  */
  static async getHistories(data) {
    let res = await this.request(`histories`, data, "get");
    return res.histories;
  }

  /** Create a history session for an exercise 
   * data = {userRef, exerciseId, userInput}
  */
  static async addHistory (data) {
    let res = await this.request(`histories`, data, "post");
    return res.workout;
  }

  /** Delete a history session. */
  static async removeHistory(id) {
    let res = await this.request(`histories/${id}`, "delete");
    return res;
  }
  
}

//testing token for use in dev environment
GanzkorperApi.token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZ" +
    "SI6InRlc3R1c2VyIiwiaXNBZG1pbiI6ZmFsc2UsImlhdCI6MTU5ODE1OTI1OX0." +
    "FtrMwBQwe6Ue-glIFgz_Nf8XxRT2YecFCiSpYL0fCXc";

export default GanzkorperApi;