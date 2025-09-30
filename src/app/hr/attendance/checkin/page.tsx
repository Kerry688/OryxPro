'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Fingerprint, 
  Smartphone, 
  Wifi, 
  User,
  MapPin,
  Calendar,
  AlertTriangle,
  CheckSquare,
  Timer
} from 'lucide-react';
import { CheckInDTO, CheckOutDTO } from '@/lib/models/attendance';

export default function CheckInOutPage() {
  const [loading, setLoading] = useState(false);
  const [employeeId, setEmployeeId] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<'biometric' | 'rfid' | 'online' | 'manual' | 'mobile_app'>('online');
  const [location, setLocation] = useState({
    latitude: 0,
    longitude: 0,
    address: '',
    deviceId: ''
  });
  const [notes, setNotes] = useState('');
  const [currentStatus, setCurrentStatus] = useState<'checked_in' | 'checked_out' | 'unknown'>('unknown');
  const [lastCheckIn, setLastCheckIn] = useState<Date | null>(null);
  const [workHours, setWorkHours] = useState(0);

  useEffect(() => {
    getCurrentLocation();
    // Check current attendance status
    checkCurrentStatus();
  }, []);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation(prev => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            address: 'Current Location' // This would typically be reverse geocoded
          }));
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  const checkCurrentStatus = async () => {
    try {
      // This would typically check the current employee's status
      // For demo purposes, we'll simulate
      const today = new Date();
      const mockStatus = Math.random() > 0.5 ? 'checked_in' : 'checked_out';
      setCurrentStatus(mockStatus);
      
      if (mockStatus === 'checked_in') {
        setLastCheckIn(new Date(Date.now() - Math.random() * 8 * 60 * 60 * 1000)); // Random time within 8 hours
        setWorkHours(Math.random() * 8);
      }
    } catch (error) {
      console.error('Error checking status:', error);
    }
  };

  const handleCheckIn = async () => {
    if (!employeeId) {
      alert('Please enter your Employee ID');
      return;
    }

    try {
      setLoading(true);
      
      const checkInData: CheckInDTO = {
        employeeId,
        method: selectedMethod,
        location: location.address ? location : undefined,
        notes: notes || undefined
      };

      const response = await fetch('/api/hr/attendance/checkin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(checkInData),
      });

      const data = await response.json();
      
      if (data.success) {
        alert('Check-in successful!');
        setCurrentStatus('checked_in');
        setLastCheckIn(new Date());
        setWorkHours(0);
        setNotes('');
      } else {
        alert('Check-in failed: ' + data.error);
      }
    } catch (error) {
      console.error('Error checking in:', error);
      alert('Check-in failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    if (!employeeId) {
      alert('Please enter your Employee ID');
      return;
    }

    try {
      setLoading(true);
      
      const checkOutData: CheckOutDTO = {
        employeeId,
        method: selectedMethod,
        location: location.address ? location : undefined,
        notes: notes || undefined
      };

      const response = await fetch('/api/hr/attendance/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(checkOutData),
      });

      const data = await response.json();
      
      if (data.success) {
        alert('Check-out successful!');
        setCurrentStatus('checked_out');
        setLastCheckIn(null);
        setWorkHours(data.data.totalWorkHours || 0);
        setNotes('');
      } else {
        alert('Check-out failed: ' + data.error);
      }
    } catch (error) {
      console.error('Error checking out:', error);
      alert('Check-out failed');
    } finally {
      setLoading(false);
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'biometric':
        return <Fingerprint className="h-4 w-4" />;
      case 'rfid':
        return <Smartphone className="h-4 w-4" />;
      case 'online':
        return <Wifi className="h-4 w-4" />;
      case 'mobile_app':
        return <Smartphone className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getMethodLabel = (method: string) => {
    switch (method) {
      case 'biometric':
        return 'Biometric';
      case 'rfid':
        return 'RFID Card';
      case 'online':
        return 'Online';
      case 'mobile_app':
        return 'Mobile App';
      default:
        return 'Manual';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold">Check In / Check Out</h1>
        <p className="text-muted-foreground">
          Record your attendance using your preferred method
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Check In/Out Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Attendance Recording
            </CardTitle>
            <CardDescription>
              Select your check-in/out method and record your attendance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Employee ID */}
            <div className="space-y-2">
              <Label htmlFor="employeeId">Employee ID</Label>
              <Input
                id="employeeId"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                placeholder="Enter your Employee ID"
                required
              />
            </div>

            {/* Check-in Method */}
            <div className="space-y-2">
              <Label>Check-in Method</Label>
              <div className="grid grid-cols-2 gap-2">
                {(['biometric', 'rfid', 'online', 'manual', 'mobile_app'] as const).map((method) => (
                  <Button
                    key={method}
                    variant={selectedMethod === method ? 'default' : 'outline'}
                    onClick={() => setSelectedMethod(method)}
                    className="flex items-center gap-2"
                  >
                    {getMethodIcon(method)}
                    {getMethodLabel(method)}
                  </Button>
                ))}
              </div>
            </div>

            {/* Location */}
            {location.address && (
              <div className="space-y-2">
                <Label>Location</Label>
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{location.address}</span>
                </div>
              </div>
            )}

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any notes about your attendance..."
                rows={3}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              {currentStatus === 'checked_out' || currentStatus === 'unknown' ? (
                <Button 
                  onClick={handleCheckIn} 
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Checking In...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Check In
                    </>
                  )}
                </Button>
              ) : (
                <Button 
                  onClick={handleCheckOut} 
                  disabled={loading}
                  variant="destructive"
                  className="flex-1"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Checking Out...
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4 mr-2" />
                      Check Out
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Current Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckSquare className="h-5 w-5" />
              Current Status
            </CardTitle>
            <CardDescription>
              Your current attendance status and work hours
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Status Badge */}
            <div className="flex items-center justify-center">
              {currentStatus === 'checked_in' ? (
                <Badge className="bg-green-100 text-green-800 border-green-200 px-4 py-2 text-lg">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Currently Checked In
                </Badge>
              ) : (
                <Badge className="bg-red-100 text-red-800 border-red-200 px-4 py-2 text-lg">
                  <XCircle className="h-5 w-5 mr-2" />
                  Currently Checked Out
                </Badge>
              )}
            </div>

            {/* Last Check-in Time */}
            {lastCheckIn && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Last Check-in</Label>
                <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">
                    {lastCheckIn.toLocaleDateString()} at {lastCheckIn.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            )}

            {/* Work Hours */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Today's Work Hours</Label>
              <div className="flex items-center gap-2 p-3 bg-orange-50 rounded-lg">
                <Timer className="h-4 w-4 text-orange-600" />
                <span className="text-sm font-medium">
                  {workHours.toFixed(1)} hours
                </span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Quick Actions</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm">
                  <Clock className="h-4 w-4 mr-1" />
                  Break Start
                </Button>
                <Button variant="outline" size="sm">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Break End
                </Button>
              </div>
            </div>

            {/* Attendance Summary */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">This Week Summary</Label>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="p-2 bg-gray-50 rounded text-center">
                  <div className="font-medium">5</div>
                  <div className="text-muted-foreground">Days Worked</div>
                </div>
                <div className="p-2 bg-gray-50 rounded text-center">
                  <div className="font-medium">40.5h</div>
                  <div className="text-muted-foreground">Total Hours</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Instructions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="space-y-2">
              <h4 className="font-medium">Biometric Check-in</h4>
              <p className="text-muted-foreground">
                Use your fingerprint or face recognition at designated biometric devices.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">RFID Card</h4>
              <p className="text-muted-foreground">
                Tap your RFID card on the card reader at the entrance.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Online Check-in</h4>
              <p className="text-muted-foreground">
                Use this web interface for remote or flexible work arrangements.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
