const Spinner = ({ size = 'md' }) => {
    const style = {
      display: 'inline-block',
      borderStyle: 'solid',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      borderColor: '#2563eb',
      borderTopColor: 'transparent',
    };
    if (size === 'sm') {
        style.width = '1rem';
        style.height = '1rem';
        style.borderWidth = '2px';
    } else {
        style.width = '2rem';
        style.height = '2rem';
        style.borderWidth = '4px';
    }
    
    return (
        <div style={{textAlign: 'center', padding: '1rem'}}>
            <div style={style}></div>
            <style>
                {`
                @keyframes spin {
                    to {
                        transform: rotate(360deg);
                    }
                }
                `}
            </style>
        </div>
    );
};

export default Spinner;