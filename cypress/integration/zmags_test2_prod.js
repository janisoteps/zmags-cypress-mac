Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test on console errors
  return false
})

var publishUrl = ''
var experienceId = ''

// Cypress uses MochaJs BDD (behavior-driven development) describe interface
describe('ZmagsSmoke', function(){
  Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test on console errors
    return false
  })

  // Each test step is wrapped in MochaJs it() interface
  it('Open Creator', function () {
    // Kick the test off with hitting the starting URL
    cy.visit('http://creator.zmags.com', { timeout: 30000 })

    // .should() methods check assertions, those can be chained
    cy.title().should('include', 'Zmags Creator')
    //   ↲               ↲            ↲
    // subject        chainer      value
  })

  it('Log into Creator', function () {
    // DOM elements are queried using jQuery DOM traversal methods
    // However unlike jQuery it will not return empty jQuery collection if the element is not found
    // Instead it will keep retrying until timeout limit is reached
    cy.get('input[type=text]')
      .type('jdzikevics@zmags.com', { delay: 100 }).should('have.value', 'jdzikevics@zmags.com')

    // type method will send key strokes sequentially, delay between strokes can be set
    cy.get('input[type=password]')
      .type('Mierakapi99!', { delay: 100 })

    cy.get('input[type="checkbox"]').click()
    cy.get('button').click()

    // Creator slowness exceeds even Cypress generous timeout limits so waiting is required
    cy.wait(5000)
    // besides MochaJs .should() also Chai assert can be used like this: expect($el).to.be.visible
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

    // Sets up a drop event dataTransfer object
    const dropEvent = {
      dataTransfer: {
            files: [
            ],
        },
    };

    // External files can be set up using .fixture() method
    // Those are then assigned to event
    cy.fixture('cat1.jpg').then((picture) => {
        return Cypress.Blob.base64StringToBlob(picture, 'image/jpeg').then((blob) => {
            dropEvent.dataTransfer.files.push(blob);
        });
    });

    // Trigger drop on the dropEvent
    cy.get('.drop-target').trigger('drop', dropEvent);

    cy.wait(2000)
    cy.get('div.js-name').should('contain', 'jpeg')
    cy.wait(2000)
    // Sometimes Creator GUI tricks Cypress into thinking that project button is covered, hence force param to click anyway
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

    // Retrieve href with pathname (makes sure we get #.... which is experience id)
    cy.window().then((win) => {
      experienceId = win.location.href + win.location.pathname
    })
    experienceId = experienceId.substr(41, 68)
    cy.log(experienceId)

    // Dropping files again
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
