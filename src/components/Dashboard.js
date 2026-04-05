import { useState } from 'react'
import React from 'react'
import { Card, Button, Alert } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Businesses from './Businesses'
import NavigationBar from './NavigationBar'

export default function Dashboard() {
  return (
    <>
    <Businesses/>
    </>
  )
}
