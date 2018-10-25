import 'tachyons'
import 'styling/semantic.less'

import React from 'react'
import { Segment, Icon, Header } from 'semantic-ui-react'

import Building from './components/building.js'

const App = () =>
    <div className="min-vh-100 w-100 flex flex-column items-center justify-center">
        <Segment className="w-100 mw8">
            <Header as='h1' size='large' textAlign='center' icon>
                <Icon name='sliders left' rotated='clockwise'/>
                Elevator Simulator
            </Header>
            <Building />
        </Segment>
    </div>

export default App
