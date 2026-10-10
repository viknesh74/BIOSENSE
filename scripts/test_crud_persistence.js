// Comprehensive verification script for BioSense Collar CRUD & Persistence
import { getCattle, addCattle, updateCattle, deleteCattle } from '../src/services/cattleService.js';

// Setup mock localStorage in Node environment if missing
if (typeof globalThis.localStorage === 'undefined') {
  let store = {};
  globalThis.localStorage = {
    getItem: (key) => store[key] || null,
    setItem: (key, val) => { store[key] = String(val); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { store = {}; }
  };
}

async function runTests() {
  console.log('🧪 Starting BioSense Collar Persistence & CRUD Tests...\n');
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${message}`);
      failed++;
    }
  }

  try {
    // Test 1: Fetch initial cattle (seed records)
    const initial = await getCattle('farmer-uma');
    assert(initial.length >= 2, `Initial cattle loaded: ${initial.length} records`);
    const meenu = initial.find(c => c.id === '101');
    assert(meenu && meenu.name === 'Meenu', 'Existing cattle (101: Meenu) preserved');
    assert(meenu && meenu.vaccinations?.length > 0, `Vaccination history preserved (${meenu?.vaccinations?.length} vaccines)`);
    assert(meenu && meenu.medicalTreatments?.length > 0, `Medical treatment history preserved (${meenu?.medicalTreatments?.length} treatments)`);

    // Test 2: Add a new collar
    const testId = `TEST-${Date.now().toString().slice(-4)}`;
    console.log(`\nAdding test collar with ID: ${testId}...`);
    const added = await addCattle({
      id: testId,
      name: 'Kamadhenu',
      breed: 'Sahiwal',
      age: '4',
      gender: 'Female',
      animalType: 'Cow',
      farmerId: 'farmer-uma'
    });
    assert(added && added.id === testId, `Collar added with ID ${testId}`);

    // Test 3: Confirm it appears in the list
    const afterAdd = await getCattle('farmer-uma');
    const foundAdded = afterAdd.find(c => c.id === testId);
    assert(foundAdded && foundAdded.name === 'Kamadhenu', 'Added collar appears in retrieved list');

    // Test 4: Simulate page refresh (getCattle reload from persistent storage)
    const refreshed = await getCattle('farmer-uma');
    const foundRefreshed = refreshed.find(c => c.id === testId);
    assert(foundRefreshed !== undefined, 'CRITICAL: Collar remains present after refresh simulation!');

    // Test 5: Prevent duplicate collar IDs
    let duplicateCaught = false;
    try {
      await addCattle({
        id: testId,
        name: 'Duplicate Cow',
        farmerId: 'farmer-uma'
      });
    } catch (e) {
      duplicateCaught = true;
      assert(true, `Duplicate collar prevented with message: "${e.message}"`);
    }
    if (!duplicateCaught) {
      assert(false, 'Duplicate collar ID was NOT rejected!');
    }

    // Test 6: Edit collar details (preserving stable ID)
    console.log(`\nEditing collar ${testId}...`);
    const updated = await updateCattle(testId, {
      name: 'Kamadhenu Deluxe',
      breed: 'Pure Sahiwal (Award)',
      age: '5 Years',
      notes: 'Collar sensor calibrated'
    });
    assert(updated.name === 'Kamadhenu Deluxe', 'Name updated correctly to Kamadhenu Deluxe');
    assert(updated.id === testId, `Stable ID preserved: ${updated.id}`);

    // Test 7: Verify updated values in persistent store after refresh
    const afterUpdateRefresh = await getCattle('farmer-uma');
    const checkUpdated = afterUpdateRefresh.find(c => c.id === testId);
    assert(checkUpdated && checkUpdated.name === 'Kamadhenu Deluxe', 'Updated values remain persistent in list');

    // Test 8: Delete collar
    console.log(`\nDeleting collar ${testId}...`);
    await deleteCattle(testId);
    const afterDelete = await getCattle('farmer-uma');
    const checkDeleted = afterDelete.find(c => c.id === testId);
    assert(checkDeleted === undefined, 'Collar successfully removed from active list');

    // Test 9: Verify deleted collar stays deleted after refresh
    const afterDeleteRefresh = await getCattle('farmer-uma');
    const checkDeletedAgain = afterDeleteRefresh.find(c => c.id === testId);
    assert(checkDeletedAgain === undefined, 'Deleted collar stays deleted after refresh');

    // Test 10: Original cattle intact
    assert(afterDeleteRefresh.length >= 2, `Original cattle remain intact: ${afterDeleteRefresh.length} records`);

    console.log(`\n========================================`);
    console.log(`Total tests: ${passed + failed}`);
    console.log(`Passed: ${passed}`);
    console.log(`Failed: ${failed}`);
    console.log(`========================================\n`);

    if (failed > 0) {
      process.exit(1);
    }
  } catch (err) {
    console.error('Test execution error:', err);
    process.exit(1);
  }
}

runTests();
