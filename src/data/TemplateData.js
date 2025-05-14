const cvTemplates = [
    {
      templateName: "Modern CV",
      sections: [
        { title: "Personal Information", fields: ["name", "email", "phone"] },
        { title: "Skills", fields: ["skill1", "skill2", "skill3"] },
        { title: "Experience", fields: ["company", "position", "duration", "description"] },
        { title: "Education", fields: ["school", "degree", "graduationDate"] },
        { title: "Objective", fields: ["goal"] },
      ],
    },
    {
      templateName: "Traditional CV",
      sections: [
        { title: "Name", fields: ["name"] },
        { title: "Contact Information", fields: ["email", "phone"] },
        { title: "Skills", fields: ["skill1", "skill2", "skill3"] },
        { title: "Work Experience", fields: ["company", "position", "years"] },
        { title: "Education", fields: ["school", "degree"] },
      ],
    },
  ];
  export default cvTemplates;
  