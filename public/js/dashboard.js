document.addEventListener('DOMContentLoaded', () => {
  const navItems = document.querySelectorAll('.dashboard-nav .nav-item');
  const sections = document.querySelectorAll('.dashboard-section');

  // Safety check: Make sure nav items and sections exist
  if (!navItems.length || !sections.length) {
    console.warn('Dashboard navigation items or sections not found.');
    return;
  }

  // Initially hide all sections
  sections.forEach(section => section.style.display = 'none');

  // Show first section and activate first nav item
  sections[0].style.display = 'block';
  navItems[0].classList.add('active');

  // Set up click event listeners for nav items
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const target = item.dataset.target;

      // Highlight active nav item
      navItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');

      // Show target section and hide others
      sections.forEach(section => {
        section.style.display = section.id === target ? 'block' : 'none';
      });
    });
  });
});
