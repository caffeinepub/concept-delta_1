import Storage "blob-storage/Storage";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import MixinStorage "blob-storage/Mixin";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  include MixinStorage();

  // Initialize the access control system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User profile system
  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Question management
  type Question = {
    id : Nat;
    classLevel : Text;
    subject : Text;
    chapter : Text;
    questionImage : ?Storage.ExternalBlob;
    correctAnswer : Text;
    marks : Nat;
    createdAt : Time.Time;
  };

  let questions = Map.empty<Nat, Question>();
  var nextQuestionId = 0;

  public shared ({ caller }) func createQuestion(
    classLevel : Text,
    subject : Text,
    chapter : Text,
    questionImage : ?Storage.ExternalBlob,
    correctAnswer : Text,
    marks : Nat,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create questions");
    };

    let question : Question = {
      id = nextQuestionId;
      classLevel;
      subject;
      chapter;
      questionImage;
      correctAnswer;
      marks;
      createdAt = Time.now();
    };

    questions.add(nextQuestionId, question);
    nextQuestionId += 1;
  };

  public query ({ caller }) func getQuestion(id : Nat) : async ?Question {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view questions");
    };
    questions.get(id);
  };

  public query ({ caller }) func getAllQuestions() : async [Question] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view questions");
    };
    questions.values().toArray();
  };

  public shared ({ caller }) func deleteQuestion(id : Nat) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete questions");
    };

    if (questions.containsKey(id)) {
      questions.remove(id);
      true;
    } else {
      false;
    };
  };

  // Test management
  type Test = {
    id : Text;
    testName : Text;
    classLevel : Text;
    subject : Text;
    duration : Nat;
    marksPerQuestion : Nat;
    questionIds : [Text];
    status : Text; // "draft" or "published"
    createdAt : Time.Time;
  };

  let tests = Map.empty<Text, Test>();

  public shared ({ caller }) func createTest(
    testName : Text,
    classLevel : Text,
    subject : Text,
    duration : Nat,
    marksPerQuestion : Nat,
    questionIds : [Text],
  ) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create tests");
    };

    let testId = testName.concat(Time.now().toText());
    let test : Test = {
      id = testId;
      testName;
      classLevel;
      subject;
      duration;
      marksPerQuestion;
      questionIds;
      status = "draft";
      createdAt = Time.now();
    };

    tests.add(testId, test);
    testId;
  };

  public shared ({ caller }) func updateTestStatus(testId : Text, status : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update test status");
    };

    switch (tests.get(testId)) {
      case (null) { Runtime.trap("Test not found") };
      case (?test) {
        let updatedTest = { test with status };
        tests.add(testId, updatedTest);
      };
    };
  };
};
