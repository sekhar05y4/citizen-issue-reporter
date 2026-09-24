import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mobile_app/app.dart';
import 'package:mobile_app/features/auth/login/login_screen.dart';
import 'package:mobile_app/features/categories/category_list_screen.dart';
import 'package:mobile_app/features/help_support/help_support_screen.dart';
import 'package:mobile_app/features/complaint_history/complaint_history_screen.dart';

void main() {
  testWidgets('Citizen App smoke test and splash navigation', (WidgetTester tester) async {
    await tester.pumpWidget(const CitizenApp());
    expect(find.byType(CitizenApp), findsOneWidget);
    // Advance time past the 2200ms splash delay timer
    await tester.pump(const Duration(milliseconds: 2500));
    await tester.pump(const Duration(milliseconds: 500));
  });

  testWidgets('LoginScreen renders form inputs and demo credentials', (WidgetTester tester) async {
    await tester.pumpWidget(const MaterialApp(home: LoginScreen()));
    expect(find.text('Citizen Login'), findsOneWidget);
    expect(find.text('Email Address'), findsOneWidget);
    expect(find.text('Password'), findsOneWidget);
    expect(find.text('Sign In'), findsOneWidget);
  });

  testWidgets('CategoryListScreen renders categories search and items', (WidgetTester tester) async {
    await tester.pumpWidget(const MaterialApp(home: CategoryListScreen()));
    expect(find.text('Civic Categories'), findsOneWidget);
    expect(find.byType(TextField), findsOneWidget);
  });

  testWidgets('ComplaintHistoryScreen renders tabs and search bar', (WidgetTester tester) async {
    await tester.pumpWidget(const MaterialApp(home: ComplaintHistoryScreen()));
    expect(find.text('Grievance History'), findsOneWidget);
    expect(find.text('All'), findsOneWidget);
    expect(find.text('Pending'), findsOneWidget);
    expect(find.text('In Progress'), findsOneWidget);
    expect(find.text('Resolved'), findsOneWidget);
  });

  testWidgets('HelpSupportScreen renders emergency helplines and FAQs', (WidgetTester tester) async {
    await tester.pumpWidget(const MaterialApp(home: HelpSupportScreen()));
    expect(find.text('Help & Support'), findsOneWidget);
    expect(find.text('112'), findsOneWidget);
    expect(find.text('National Emergency'), findsOneWidget);
    expect(find.text('Frequently Asked Questions'), findsOneWidget);
  });
}
