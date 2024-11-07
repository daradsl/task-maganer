function getRandomName() {
    const firstNames = ["João", "Maria", "José", "Ana", "Pedro"];
    const lastNames = ["Silva", "Santos", "Oliveira", "Souza", "Pereira"];
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const randomNum = Math.floor(Math.random() * 1000);
    return `${firstName} ${lastName} ${randomNum}`;
  }
  
  function getRandomEmail() {
    const domains = ["example.com", "mail.com", "test.com"];
    const randomUser = Math.random().toString(36).substring(2, 8);
    const domain = domains[Math.floor(Math.random() * domains.length)];
    const randomNum = Math.floor(Math.random() * 1000);
    return `${randomUser}${randomNum}@${domain}`;
  }
  
  function getFixedBirthDateForCreate() {
    return "2000-01-15";
  }
  
  function getFixedBirthDateForUpdate() {
    return "1995-06-25";
  }
  
  function generateUserData(context, events, done) {
    context.vars.name = getRandomName();
    context.vars.email = getRandomEmail();
    context.vars.birthDate = getFixedBirthDateForCreate();
    return done();
  }
  
  function generateUpdateData(context, events, done) {
    context.vars.updatedName = `Atualizado ${getRandomName()}`;
    context.vars.updatedEmail = getRandomEmail();
    context.vars.updatedBirthDate = getFixedBirthDateForUpdate();
    return done();
  }
  
  module.exports = {
    generateUserData,
    generateUpdateData,
  };
  