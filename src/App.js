import 'tachyons'
import 'styling/semantic.less'

import React from 'react'
import { Container, Icon, Header } from 'semantic-ui-react'

import Building from './components/building.js'

const App = () =>
    <div className="min-vh-100 w-100 flex flex-column items-center justify-center">
        <Container style={{'margin-top': '20px'}}>
            <Header as='h1' size='large' textAlign='center'>
                <Icon name='sliders left' rotated='clockwise'/>
                Elevator Simulator
            </Header>
            <Building />
        </Container>
    </div>

export default App
