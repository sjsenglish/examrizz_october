'use client';

import React, { useState } from 'react';
import './add-students.css';

/**
 * ADD STUDENTS PAGE - Teacher Portal
 * 
 * This page allows teachers to search and add students to their classes.
 * Replicates the design from teacher/class/[classId] All Students tab.
 * Features:
 * - School filter tabs (Brixton 6th Form, St Paul's Girls School)
 * - Student search functionality
 * - Sortable student table
 * - Checkbox selection for adding students
 */

interface Student {
  id: string;
  surname: string;
  firstName: string;
  dateOfBirth: string;
  year: string;
  className: string;
  email: string;
  selected?: boolean;
}

const mockStudents: Student[] = [
  {
    id: '1',
    surname: 'Mayer',
    firstName: 'Sarah',
    dateOfBirth: '17/03/1996',
    year: 'Year 12',
    className: 'A Level Economics Set 1',
    email: 'testeremail23456@gmail.com'
  },
  {
    id: '2',
    surname: 'Juicer',
    firstName: 'Bob',
    dateOfBirth: '17/03/1996',
    year: 'Year 10',
    className: 'A Level Maths Set 1',
    email: 'testeremail23456@gmail.com'
  },
  {
    id: '3',
    surname: 'Weller',
    firstName: 'Max',
    dateOfBirth: '17/03/1996',
    year: 'Year 10',
    className: 'A Level Maths Set 1',
    email: 'testeremail23456@gmail.com'
  },
  {
    id: '4',
    surname: 'Weller',
    firstName: 'Max',
    dateOfBirth: '17/03/1996',
    year: 'Year 11',
    className: 'A Level Maths Set 1',
    email: 'testeremail23456@gmail.com'
  },
  {
    id: '5',
    surname: 'Weller',
    firstName: 'Max',
    dateOfBirth: '17/03/1996',
    year: 'Year 11',
    className: 'A Level Maths Set 1',
    email: 'testeremail23456@gmail.com'
  },
  {
    id: '6',
    surname: 'Weller',
    firstName: 'Max',
    dateOfBirth: '17/03/1996',
    year: 'Year 11',
    className: 'A Level Maths Set 1',
    email: 'testeremail23456@gmail.com'
  },
  {
    id: '7',
    surname: 'Weller',
    firstName: 'Max',
    dateOfBirth: '17/03/1996',
    year: 'Year 11',
    className: 'A Level Maths Set 1',
    email: 'testeremail23456@gmail.com'
  }
];

export default function AddStudentsPage() {
  const [selectedSchool, setSelectedSchool] = useState('Brixton 6th Form, London');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('Surname');
  const [students, setStudents] = useState(mockStudents);

  const schools = [
    'Brixton 6th Form, London',
    'St Paul\'s Girls School, London'
  ];

  const handleStudentSelect = (studentId: string) => {
    setStudents(prevStudents =>
      prevStudents.map(student =>
        student.id === studentId
          ? { ...student, selected: !student.selected }
          : student
      )
    );
  };

  const filteredStudents = students.filter(student =>
    student.surname.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.year.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.className.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedStudents = [...filteredStudents].sort((a, b) => {
    switch (sortBy) {
      case 'Surname':
        return a.surname.localeCompare(b.surname);
      case 'First name':
        return a.firstName.localeCompare(b.firstName);
      case 'Date of Birth':
        return a.dateOfBirth.localeCompare(b.dateOfBirth);
      case 'Year':
        return a.year.localeCompare(b.year);
      case 'Class':
        return a.className.localeCompare(b.className);
      case 'Email':
        return a.email.localeCompare(b.email);
      default:
        return 0;
    }
  });

  return (
    <div className="add-students-wrapper">
      {/* Navbar */}
      <nav className="navbar">
        <a href="/" className="navbar-logo">
          examrizzsearch
        </a>
        <button className="navbar-menu">
          <div className="navbar-menu-line"></div>
          <div className="navbar-menu-line"></div>
          <div className="navbar-menu-line"></div>
        </button>
      </nav>

      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">Add Students</h1>
      </div>

      {/* School Tabs */}
      <div className="school-tabs-wrapper">
        <div className="school-tabs-container">
          <div className="school-tabs-label">Your School(s)</div>
          <div className="school-tabs">
            {schools.map((school) => (
              <button
                key={school}
                className={`school-tab ${selectedSchool === school ? 'active' : ''}`}
                onClick={() => setSelectedSchool(school)}
              >
                {school}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Container */}
      <div className="content-container">
        {/* Controls */}
        <div className="students-controls">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search students by name, email, birthday, year or class ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <div className="search-icon">🔍</div>
          </div>
          <div className="sort-container">
            <span className="sort-label">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="Surname">Surname</option>
              <option value="First name">First name</option>
              <option value="Date of Birth">Date of Birth</option>
              <option value="Year">Year</option>
              <option value="Class">Class</option>
              <option value="Email">Email</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="table-container">
          {/* Table Header */}
          <div className="table-header">
            <div className="header-cell checkbox-cell">
              <button className="header-checkbox">×</button>
            </div>
            <div className="header-cell">Surname</div>
            <div className="header-cell">First name</div>
            <div className="header-cell">Date of Birth</div>
            <div className="header-cell">Year</div>
            <div className="header-cell">Class</div>
            <div className="header-cell">Email</div>
          </div>

          {/* Table Body */}
          <div className="table-body">
            {sortedStudents.map((student) => (
              <div key={student.id} className="table-row">
                <div className="table-cell checkbox-cell">
                  <input
                    type="checkbox"
                    checked={student.selected || false}
                    onChange={() => handleStudentSelect(student.id)}
                    className="student-checkbox"
                  />
                </div>
                <div className="table-cell">{student.surname}</div>
                <div className="table-cell">{student.firstName}</div>
                <div className="table-cell">{student.dateOfBirth}</div>
                <div className="table-cell">{student.year}</div>
                <div className="table-cell">{student.className}</div>
                <div className="table-cell">{student.email}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Help Popup */}
        <div className="help-popup">
          <button className="help-close">×</button>
          <div className="help-content">
            Need to add a school to your profile? Contact us!
          </div>
        </div>

        {/* Bottom Right Ghost Icon */}
        <div className="ghost-icon">
          <div className="ghost-character">👻</div>
          <div className="ghost-book">📚</div>
        </div>
      </div>
    </div>
  );
}