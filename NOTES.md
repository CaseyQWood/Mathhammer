# Table Top Calculator

## Release Cycle

**_MVP_**

- Users can run a simulation between attacker(s) and defender
  - Returns the mean, 80% band and the chart of the results
- Users can add/remove/edit models to the attacking "unit" and edit the defending stat brick
- Has all included modifiers + fishing
  - Include critical roll value for anti-\* abilities or 5+ to crit abilities
  - +1/-1 to hit/wound <--- I dont think I need this
- Has custom Domain
- Mobile/Desktop compatible
- release to testing group
- reRoll saves

**_MMP_**

- All previous steps
- Implement findings from MVP
- User can login/logout
- User state is saved ( maybe via session storage or one of the other browser storage options )
- Monitization
  - Will need to run some rough estimates on incomeVScost predictions
  - Google ads
  - Subscription model

**_MLP_**

- results include model specific breakdowns
- can download results
  - So you can easily share with others
- You can save units for quick access
- Multiple sessions at once
  - carosel style on mobile, letting you swipe left and right to access other open/editable states
- Allow User Settings

## TODO:

- Styling for desktop + mobile

- add remove attack stats button
- Update variableCalculator to cover more cases as it also manages damage
- add instance carousel
- unify default value managment between components
- make sure all components are controlled components
- Setup saving units
- determine if I should move to models killed VS wounds done. because some defenders have multiple wounds because of the non overflow when feel no pain is involved
- Complete design
- Mobile friendly up and down arrows for values ( do I think this is required ? )
- improve mobile inputs
- - configure the go button

BUGS:

- Proccess hits if a dice roll returns undefined it counts as a passing roll
