if [ $# -gt 0 ] ; then
    git init
    git add .
    git commit -m "$*"
    git push origin HEAD:master
else
    echo "No input"
fi