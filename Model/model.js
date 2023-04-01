const mongoose = require("mongoose");
const databaseSchema = new mongoose.Schema({
  username: {
    // required: true,
    type: String,
    unique: true,
  },
  email: {
    // required: true,
    type: String,
    unique: true,
  },
  phone: {
    // required: true,
    type: String,
  },
  password:{
    type:String,
  },
  name: {
    // required: true,
    type: String,
  },
  hobby: {
    // required: true,
    type: String,
  },
  comment: {
    type: String,
  },
  address: {
    street: {
      type: String,
    },
    city: {
      type: String,
    },
    pin: {
      type: Number,
    },
  },
  skills: {
    softSkill: {
      softSkillOne: {
        type: String,
      },
      softSkillTwo: {
        type: String,
      },
      softSkillThree: {
        type: String,
      },
    },
    hardSkill: {
      hardSkillOne: {
        type: String,
      },
      hardSkillTwo: {
        type: String,
      },
      hardSkillThree: {
        type: String,
      },
    },
  },
  qualifications: {
    education: {
      school: {
        type: String,
      },
      diploma: {
        type: String,
      },
      degree: {
        type: String,
      },
      masters: {
        type: String,
      },
    },
    others: {
      sports: {
        type: String,
      },
      extraCurricular: {
        type: String,
      },
    },
  },
  marksObtained: {
    HighSchoolExam: {
      MIL: {
        type: Number,
      },
      English: {
        type: Number,
      },
      Mathematics: {
        type: Number,
      },
      AdvancedMaths: {
        type: Number,
      },
      SocialScience: {
        type: Number,
      },
      GeneralScience: {
        type: Number,
      },
    },
  },
});

module.exports = mongoose.model("data", databaseSchema);
