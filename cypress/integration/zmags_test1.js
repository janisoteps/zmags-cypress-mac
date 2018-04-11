Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  return false
})

var publishUrl = ''
var experienceId = ''

describe('ZmagsSmoke', function(){
  Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false
  })
  it('Open Creator', function () {
    // https://on.cypress.io/visit
    cy.visit('http://creator-dev.zmags.com/', { timeout: 30000 })

    // https://on.cypress.io/title
    cy.title().should('include', 'Zmags Creator')
    //   ↲               ↲            ↲
    // subject        chainer      value
  })

  it('Log into Creator', function () {
    // https://on.cypress.io/type
    cy.get('input[type=text]')
      .type('janisdzikevics@gmail.com', { delay: 100 }).should('have.value', 'janisdzikevics@gmail.com')

    cy.get('input[type=password]')
      .type('Mierakapi99!', { delay: 100 })

    cy.get('input[type="checkbox"]').click()
    cy.get('button').click()

    cy.wait(5000)
    cy.get('header.title-field').should('be.visible')
  })

  it('Create a new project', function(){
    cy.get('.project-btn-txt').click()
    cy.get('.create-project-field').should('be.visible')
    cy.get('.create-project-field').click()
    cy.wait(4000)
    cy.get('.attach-button').should('be.visible')
    var projName = 'Test project ' + Date.now()
    cy.get('h1.editable').clear()
    cy.get('h1.editable').type(projName)
  })

  it('Upload an image', function(){
    cy.get('.images-tab').click()
    cy.wait(2000)

    const dropEvent = {
      dataTransfer: {
            files: [
            ],
        },
    };

    cy.fixture('cat1.jpg').then((picture) => {
        return Cypress.Blob.base64StringToBlob(picture, 'image/jpeg').then((blob) => {
            dropEvent.dataTransfer.files.push(blob);
        });
    });

    cy.get('.drop-target').trigger('drop', dropEvent);

    cy.wait(2000)
    cy.get('div.js-name').should('contain', 'cat1.jpeg')
    cy.wait(2000)
    cy.get('a.project-context-btn').click({force: true})
  })

  it('Create a new experience', function(){
    cy.wait(5000)
    cy.get('.create-experience-content-item').click()
    cy.wait(5000)
    cy.get('span.name-input').should('be.visible')
    var expName = 'Test experience ' + Date.now()
    cy.get('span.name-input').clear()
    cy.get('span.name-input').type(expName)
    var regexp = "experience/";
    cy.window().then((win) => {
      experienceId = win.location.href + win.location.pathname
    })
    experienceId = experienceId.substr(41, 68)
    cy.log(experienceId)


    const dropEvent = {
      dataTransfer: {
            files: [
            ],
        },
      force: true
    };
    cy.fixture('cat1.jpg').then((picture) => {
        return Cypress.Blob.base64StringToBlob(picture, 'image/jpeg').then((blob) => {
            dropEvent.dataTransfer.files.push(blob);
        });
    });
    cy.get('.drop-target').trigger('drop', dropEvent);

    cy.get('.push-btn').click()
    cy.get('.add-new-scene').click()
    cy.get('.show-backdrop').click()
    cy.get('.backdrop-options-color-library div:nth-child(5) span:nth-child(5)').click()
    cy.get('.actions > button.ok-btn').click()
    cy.get('.create-new-variant > a').click()
    cy.get('.add-breakpoint-variant').click()
    cy.wait(10000)
    cy.get('.push-group-btn').click()
    cy.wait(8000)
  })

  it('Publish experience to a test page', function(){
    cy.on('uncaught:exception', (err, runnable) => {
      return false
    })
    cy.get('div.first-line > button.publish-btn').click()
    cy.wait(4000)
    cy.get('span#create-new-slot').click()
    var slotName = 'Test slot ' + Date.now()
    cy.get('div.editable').clear()
    cy.get('div.editable').type(slotName)
    var publishSelector = 'test' + Date.now()
    cy.get('input.selector').type('.' + publishSelector)
    publishUrl = 'http://viewer-test-tool.us-east-2.elasticbeanstalk.com/?experienceId=' + experienceId + '&viewerVersion=&channelId=&customerId=&viewerHeight=&viewerWidth=700&viewers=legacy,cnc'
    cy.get('input.url').type(publishUrl)
    cy.get('div.live-select > a.select2-choice').click()
    cy.wait(3000)
    cy.get('ul.select2-results > li:nth-child(2)').click()
    cy.get('button.btn-ok').click()
    cy.get('button#publish-channels').click()
    cy.wait(3000)
  })
})

describe('CheckViewer', function(){
  it('Print out viewer URL', function () {
    cy.log(experienceId)
  })
})
